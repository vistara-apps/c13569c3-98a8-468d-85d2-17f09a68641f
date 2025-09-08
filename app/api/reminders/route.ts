import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { generateId } from '@/lib/utils';
import { DAILY_DUAS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const today = searchParams.get('today') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let reminders;
    if (today) {
      reminders = await dbHelpers.getTodaysReminders(userId);
    } else {
      reminders = await dbHelpers.getUserReminders(userId);
    }

    return NextResponse.json({
      success: true,
      reminders: reminders.map(reminder => ({
        reminderId: reminder.reminder_id,
        userId: reminder.user_id,
        duaTitle: reminder.dua_title,
        duaText: reminder.dua_text,
        duaArabic: reminder.dua_arabic,
        scheduledTime: reminder.scheduled_time,
        notificationSent: reminder.notification_sent,
        completed: reminder.completed,
        createdAt: new Date(reminder.created_at),
      }))
    });
  } catch (error) {
    console.error('Get reminders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, duaTitle, duaText, duaArabic, scheduledTime } = body;

    if (!userId || !duaTitle || !duaText || !scheduledTime) {
      return NextResponse.json(
        { error: 'User ID, dua title, dua text, and scheduled time are required' },
        { status: 400 }
      );
    }

    const reminderId = generateId();

    const reminder = await dbHelpers.createReminder({
      reminder_id: reminderId,
      user_id: userId,
      dua_title: duaTitle,
      dua_text: duaText,
      dua_arabic: duaArabic || null,
      scheduled_time: scheduledTime,
      notification_sent: false,
      completed: false,
    });

    return NextResponse.json({
      success: true,
      reminder: {
        reminderId: reminder.reminder_id,
        userId: reminder.user_id,
        duaTitle: reminder.dua_title,
        duaText: reminder.dua_text,
        duaArabic: reminder.dua_arabic,
        scheduledTime: reminder.scheduled_time,
        notificationSent: reminder.notification_sent,
        completed: reminder.completed,
        createdAt: new Date(reminder.created_at),
      },
      message: 'Reminder created successfully'
    });
  } catch (error) {
    console.error('Create reminder API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reminderId, updates } = body;

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      );
    }

    const updatedReminder = await dbHelpers.updateReminder(reminderId, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      reminder: {
        reminderId: updatedReminder.reminder_id,
        userId: updatedReminder.user_id,
        duaTitle: updatedReminder.dua_title,
        duaText: updatedReminder.dua_text,
        duaArabic: updatedReminder.dua_arabic,
        scheduledTime: updatedReminder.scheduled_time,
        notificationSent: updatedReminder.notification_sent,
        completed: updatedReminder.completed,
        createdAt: new Date(updatedReminder.created_at),
      },
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Update reminder API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate daily reminders for a user
export async function POST_GENERATE_DAILY(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const generatedReminders = [];
    const today = new Date();
    
    // Generate reminders based on user preferences
    const times = preferences?.customTimes || ['06:00', '18:00'];
    const duaTypes = preferences?.duaTypes || ['Morning', 'Evening'];

    for (let i = 0; i < times.length && i < duaTypes.length; i++) {
      const time = times[i];
      const duaType = duaTypes[i];
      
      // Find a suitable dua for this type
      const availableDuas = DAILY_DUAS.filter(dua => 
        dua.category.toLowerCase() === duaType.toLowerCase()
      );
      
      if (availableDuas.length > 0) {
        const selectedDua = availableDuas[Math.floor(Math.random() * availableDuas.length)];
        
        const reminder = await dbHelpers.createReminder({
          reminder_id: generateId(),
          user_id: userId,
          dua_title: selectedDua.title,
          dua_text: selectedDua.translation,
          dua_arabic: selectedDua.arabic,
          scheduled_time: time,
          notification_sent: false,
          completed: false,
        });

        generatedReminders.push({
          reminderId: reminder.reminder_id,
          userId: reminder.user_id,
          duaTitle: reminder.dua_title,
          duaText: reminder.dua_text,
          duaArabic: reminder.dua_arabic,
          scheduledTime: reminder.scheduled_time,
          notificationSent: reminder.notification_sent,
          completed: reminder.completed,
          createdAt: new Date(reminder.created_at),
        });
      }
    }

    return NextResponse.json({
      success: true,
      reminders: generatedReminders,
      message: `Generated ${generatedReminders.length} daily reminders`
    });
  } catch (error) {
    console.error('Generate daily reminders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
