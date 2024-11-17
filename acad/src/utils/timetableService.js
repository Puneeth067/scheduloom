import { supabase } from '@/utils/supabaseClient';

export async function saveTimetableToDatabase(timetableData, userId) {
    try {
        // Check if a timetable already exists for this user
        const { data: existingTimetable, error: fetchError } = await supabase
            .from('timetables')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (existingTimetable) {
            // Update existing timetable
            const { error: updateError } = await supabase
                .from('timetables')
                .update({
                    timetable_data: timetableData,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;
        } else {
            // Insert new timetable
            const { error: insertError } = await supabase
                .from('timetables')
                .insert({
                    user_id: userId,
                    timetable_data: timetableData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (insertError) throw insertError;
        }

        return { success: true };
    } catch (error) {
        console.error('Error saving timetable:', error);
        return { success: false, error };
    }
}

export async function fetchUserTimetable(userId) {
    try {
        const { data, error } = await supabase
            .from('timetables')
            .select('timetable_data')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { success: true, data: data?.timetable_data };
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return { success: false, error };
    }
}