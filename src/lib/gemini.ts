import { GoogleGenerativeAI } from '@google/generative-ai';
import { Task } from '@/types/task';

// Initialize the Google Generative AI with your API key
// In a production environment, this should be stored in an environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBx77FA_On7xhdmxkygluK8LJDPjkZYAzo';
const genAI = new GoogleGenerativeAI(API_KEY);

// Define the types for AI suggestions
export interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  isPremium: boolean;
}

/**
 * Analyzes user tasks and generates personalized task suggestions
 * @param tasks The user's existing tasks
 * @param routines Optional user's daily routines data
 * @returns An array of task suggestions
 */
export async function generateTaskSuggestions(tasks: Task[], routines: any[] = []): Promise<TaskSuggestion[]> {
  try {
    // If there are no tasks, return some default suggestions
    if (tasks.length === 0) {
      return getDefaultSuggestions();
    }

    // Prepare the data for Gemini
    const taskData = prepareTaskDataForAnalysis(tasks);
    
    // Generate the prompt for Gemini
    const prompt = generatePrompt(taskData, routines);
    
    // Get a response from Gemini with improved configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into task suggestions
      return parseGeminiResponse(text);
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      // Try with a simpler model if the first one fails
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        const fallbackResponse = await fallbackResult.response;
        const fallbackText = fallbackResponse.text();
        
        return parseGeminiResponse(fallbackText);
      } catch (fallbackError) {
        console.error('Fallback model error:', fallbackError);
        return getDefaultSuggestions();
      }
    }
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    // Return default suggestions if there's an error
    return getDefaultSuggestions();
  }
}

/**
 * Prepares task data for analysis by Gemini
 */
function prepareTaskDataForAnalysis(tasks: Task[]) {
  // Extract relevant information from tasks
  return tasks.map(task => ({
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    priority: task.priority,
    tags: task.tags,
    createdAt: task.createdAt.toISOString(),
  }));
}

/**
 * Generates a prompt for Gemini based on user's task data and routines
 */
function generatePrompt(taskData: any, routines: any[] = []) {
  // Extract user's common tags for better suggestions
  const userTags = new Set<string>();
  taskData.forEach((task: any) => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach((tag: string) => userTags.add(tag));
    }
  });
  
  // Analyze task completion patterns
  const completedTasks = taskData.filter((task: any) => task.status === 'completed');
  const pendingTasks = taskData.filter((task: any) => task.status === 'pending');
  const completionRate = taskData.length > 0 ? completedTasks.length / taskData.length : 0;
  
  // Format routines data for the prompt if available
  const routinesSection = routines.length > 0 ? 
    `\nUser's daily routines:\n${JSON.stringify(routines, null, 2)}` : '';

  // Add task completion patterns to provide context
  const taskPatterns = `
    Task completion patterns:
    - Completion rate: ${(completionRate * 100).toFixed(1)}%
    - Completed tasks: ${completedTasks.length}
    - Pending tasks: ${pendingTasks.length}
    - Common tags: ${Array.from(userTags).join(', ')}
  `;

  return `
    You are an AI assistant that helps users manage their tasks and improve productivity.
    Based on the following task history, completion patterns, and daily routines, suggest 3 new tasks that would be helpful for the user.
    
    User's task history:
    ${JSON.stringify(taskData, null, 2)}
    ${taskPatterns}
    ${routinesSection}
    
    Consider the following when making suggestions:
    - Suggest tasks that align with the user's existing task patterns and preferences
    - If the user has many incomplete tasks, suggest organizational tasks to help manage them
    - If the user has high completion rates, suggest more challenging tasks
    - Use the user's existing tags when relevant, but feel free to suggest new ones if appropriate
    - Suggest tasks that complement existing tasks, not duplicate them
    - Consider the user's daily routines when scheduling tasks:
      - Wake-up time and sleep time to suggest tasks at appropriate hours
      - Meal times (breakfast, lunch, dinner) to avoid scheduling during these times
      - Work start and end times to distinguish between work and personal tasks
      - Exercise time to promote health-related tasks
    
    For each suggestion, provide:
    1. A clear, concise title
    2. A brief description explaining the value of the task
    3. A suggested due date (in ISO format)
    4. A priority level (low, medium, or high)
    5. Relevant tags based on the user's existing tags
    
    Format your response as a JSON array with objects containing these fields:
    [{
      "title": "Task title",
      "description": "Task description",
      "dueDate": "YYYY-MM-DDT00:00:00.000Z",
      "priority": "medium",
      "tags": ["tag1", "tag2"]
    }]
  `;
}

/**
 * Parses the response from Gemini into task suggestions
 */
function parseGeminiResponse(text: string): TaskSuggestion[] {
  try {
    // Try to extract JSON from the response (in case Gemini adds explanatory text)
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    
    // Try to parse the response as JSON
    const suggestions = JSON.parse(jsonText);
    
    if (!Array.isArray(suggestions)) {
      console.error('Gemini response is not an array:', suggestions);
      return getDefaultSuggestions();
    }
    
    // Validate and transform the suggestions
    return suggestions.map((suggestion: any, index: number) => {
      // Validate required fields
      if (!suggestion.title) {
        console.warn('Suggestion missing title, using default');
      }
      
      // Ensure due date is valid
      let dueDate: Date;
      try {
        dueDate = suggestion.dueDate ? new Date(suggestion.dueDate) : new Date(Date.now() + 86400000);
        // Check if date is valid
        if (isNaN(dueDate.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (e) {
        console.warn('Invalid due date in suggestion, using tomorrow');
        dueDate = new Date(Date.now() + 86400000); // Default to tomorrow
      }
      
      return {
        id: `ai-suggestion-${Date.now()}-${index}`,
        title: suggestion.title || 'Suggested Task',
        description: suggestion.description || '',
        dueDate,
        priority: ['low', 'medium', 'high'].includes(suggestion.priority) ? suggestion.priority : 'medium',
        tags: Array.isArray(suggestion.tags) ? suggestion.tags : [],
        isPremium: true // Mark as premium feature
      };
    });
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return getDefaultSuggestions();
  }
}

/**
 * Returns default task suggestions when AI generation fails or is unavailable
 */
function getDefaultSuggestions(): TaskSuggestion[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: `ai-suggestion-${Date.now()}-1`,
      title: 'Create a weekly planning session',
      description: 'Set aside 30 minutes every Sunday to plan your week ahead and prioritize tasks.',
      dueDate: tomorrow,
      priority: 'high',
      tags: ['productivity', 'planning'],
      isPremium: true
    },
    {
      id: `ai-suggestion-${Date.now()}-2`,
      title: 'Set up task categories',
      description: 'Organize your tasks into categories like work, personal, health, etc. for better management.',
      dueDate: tomorrow,
      priority: 'medium',
      tags: ['organization', 'productivity'],
      isPremium: true
    },
    {
      id: `ai-suggestion-${Date.now()}-3`,
      title: 'Review and reflect on completed tasks',
      description: 'Take time to review what you\'ve accomplished and reflect on your productivity patterns.',
      dueDate: nextWeek,
      priority: 'low',
      tags: ['reflection', 'productivity'],
      isPremium: true
    }
  ];
}