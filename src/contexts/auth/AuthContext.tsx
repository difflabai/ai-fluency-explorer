
import React, { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthContextType } from './types';
import { cleanupAuthState, checkAdminStatus } from '@/utils/authUtils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { cleanupAuthState };
