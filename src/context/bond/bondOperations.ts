
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { generateBondCode } from './utils';
import { Theme } from './types';

// Create a new bond in Supabase
export const createBondWithSupabase = async (
  userId: string,
  bondName: string,
  bondReason: string,
  currentTheme: Theme,
  quote: string,
) => {
  try {
    const newBondCode = generateBondCode();
    
    // Create the bond
    const { data: bondData, error: bondError } = await supabase
      .from('bonds')
      .insert([
        { 
          name: bondName, 
          reason: bondReason, 
          start_date: new Date().toISOString(),
          theme: currentTheme,
          code: newBondCode
        }
      ])
      .select('id')
      .single();

    if (bondError) {
      toast({
        title: "Error creating bond",
        description: bondError.message,
        variant: "destructive"
      });
      return null;
    }

    const newBondId = bondData.id;

    // Add current user as a member
    const { error: memberError } = await supabase
      .from('bond_members')
      .insert([
        { bond_id: newBondId, user_id: userId }
      ]);

    if (memberError) {
      toast({
        title: "Error adding user to bond",
        description: memberError.message,
        variant: "destructive"
      });
      return null;
    }

    // Create initial bond settings
    const { error: settingsError } = await supabase
      .from('bond_settings')
      .insert([
        { bond_id: newBondId, quote: quote }
      ]);

    if (settingsError) {
      toast({
        title: "Error creating bond settings",
        description: settingsError.message,
        variant: "destructive"
      });
    }

    localStorage.setItem('bondId', newBondId);
    localStorage.setItem('bondCode', newBondCode);

    return newBondCode;
  } catch (error) {
    console.error("Error creating bond:", error);
    toast({
      title: "Error",
      description: "Failed to create bond. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

// Join an existing bond
export const joinBondWithSupabase = async (code: string, userId: string) => {
  try {
    // Find the bond with the provided code
    const { data: bondData, error: bondError } = await supabase
      .from('bonds')
      .select('*')
      .eq('code', code)
      .single();

    if (bondError) {
      toast({
        title: "Error joining bond",
        description: "Bond code not found",
        variant: "destructive"
      });
      return { success: false, bondData: null };
    }

    // Check if user is already a member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('bond_members')
      .select('*')
      .eq('bond_id', bondData.id)
      .eq('user_id', userId)
      .single();

    if (!existingMember && !memberCheckError) {
      // Add user as a bond member
      const { error: memberError } = await supabase
        .from('bond_members')
        .insert([
          { bond_id: bondData.id, user_id: userId }
        ]);

      if (memberError) {
        toast({
          title: "Error joining bond",
          description: memberError.message,
          variant: "destructive"
        });
        return { success: false, bondData: null };
      }
    }

    // Save bond info to local storage
    localStorage.setItem('bondId', bondData.id);
    localStorage.setItem('bondCode', code);

    toast({
      title: "Success!",
      description: `You've joined "${bondData.name}"!`,
    });

    return { success: true, bondData };
  } catch (error) {
    console.error("Error joining bond:", error);
    toast({
      title: "Error",
      description: "Failed to join bond. Please try again.",
      variant: "destructive"
    });
    return { success: false, bondData: null };
  }
};

// Load bond data from Supabase
export const loadBondDataFromSupabase = async (bondId: string, userId: string) => {
  if (!bondId) return null;

  try {
    // Load bond details
    const { data: bondData, error: bondError } = await supabase
      .from('bonds')
      .select('*')
      .eq('id', bondId)
      .single();

    if (bondError) {
      console.error("Error loading bond data:", bondError);
      return null;
    }

    // Load bond settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('bond_settings')
      .select('*')
      .eq('bond_id', bondId)
      .single();

    let quote = 'Love is the bridge between two hearts';
    if (!settingsError && settingsData) {
      quote = settingsData.quote || quote;
    }

    // Load bond members
    const { data: membersData, error: membersError } = await supabase
      .from('bond_members')
      .select('user_id')
      .eq('bond_id', bondId);

    let partnerId = null;
    if (!membersError && membersData) {
      const partners = membersData.filter(member => member.user_id !== userId);
      if (partners.length > 0) {
        partnerId = partners[0].user_id;
      }
    }

    // Load my data
    const { data: myData } = await supabase
      .from('bond_data')
      .select('*')
      .eq('bond_id', bondId)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    let myStatus = '';
    let myActivity = '';
    let myPlan = '';
    
    if (myData && myData.length > 0) {
      if (myData[0].status) myStatus = myData[0].status;
      if (myData[0].activity) myActivity = myData[0].activity;
      if (myData[0].plan) myPlan = myData[0].plan;
    }

    // Load partner data if partnerId exists
    let partnerStatus = '';
    let partnerActivity = '';
    let partnerPlan = '';
    
    if (partnerId) {
      const { data: partnerData } = await supabase
        .from('bond_data')
        .select('*')
        .eq('bond_id', bondId)
        .eq('user_id', partnerId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (partnerData && partnerData.length > 0) {
        if (partnerData[0].status) partnerStatus = partnerData[0].status;
        if (partnerData[0].activity) partnerActivity = partnerData[0].activity;
        if (partnerData[0].plan) partnerPlan = partnerData[0].plan;
      }
    }

    return {
      bondName: bondData.name,
      bondReason: bondData.reason || '',
      bondStartDate: new Date(bondData.start_date),
      currentTheme: bondData.theme,
      quote,
      myStatus,
      partnerStatus,
      myActivity,
      partnerActivity,
      myPlan,
      partnerPlan,
      partnerId
    };

  } catch (error) {
    console.error("Error loading bond data:", error);
    return null;
  }
};

// Sync data updates to Supabase
export const syncDataToSupabase = async (
  type: 'status' | 'activity' | 'plan', 
  value: string, 
  bondId: string, 
  userId: string
) => {
  if (!bondId || !value) return false;

  try {
    // Check if existing record
    const { data: existingData, error: checkError } = await supabase
      .from('bond_data')
      .select('id')
      .eq('bond_id', bondId)
      .eq('user_id', userId)
      .not(type, 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error(`Error checking existing ${type} data:`, checkError);
      return false;
    }

    const updateData = { [type]: value, updated_at: new Date().toISOString() };

    if (existingData && existingData.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('bond_data')
        .update(updateData)
        .eq('id', existingData[0].id);

      if (updateError) {
        console.error(`Error updating ${type}:`, updateError);
        return false;
      }
    } else {
      // Insert new record
      const insertData = { bond_id: bondId, user_id: userId, [type]: value };
      const { error: insertError } = await supabase
        .from('bond_data')
        .insert([insertData]);

      if (insertError) {
        console.error(`Error inserting ${type}:`, insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error syncing ${type}:`, error);
    return false;
  }
};

// Sync quote to Supabase
export const syncQuoteToSupabase = async (quote: string, bondId: string) => {
  if (!bondId) return false;

  try {
    const { error: updateError } = await supabase
      .from('bond_settings')
      .update({ 
        quote,
        updated_at: new Date().toISOString()
      })
      .eq('bond_id', bondId);

    if (updateError) {
      console.error("Error updating quote:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing quote:", error);
    return false;
  }
};

// Sync theme to Supabase
export const syncThemeToSupabase = async (theme: Theme, bondId: string) => {
  if (!bondId) return false;

  try {
    const { error: updateError } = await supabase
      .from('bonds')
      .update({ theme })
      .eq('id', bondId);

    if (updateError) {
      console.error("Error updating theme:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing theme:", error);
    return false;
  }
};
