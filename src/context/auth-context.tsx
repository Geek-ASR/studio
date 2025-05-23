
"use client";

import type { UserProfile, UserRole, MentorProfile, MenteeProfile, EnrichedBooking, AvailabilitySlot, Booking, ExperienceItem, GroupSession, Webinar } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Initial Mock Group Sessions Data
const INITIAL_MOCK_GROUP_SESSIONS: GroupSession[] = [
  {
    id: 'gs1',
    title: 'Mastering Data Structures & Algorithms',
    description: 'Join our interactive group session to tackle common DSA problems and improve your coding interview skills. Collaborative problem-solving, weekly challenges, and mock interview practice. This session is ideal for students preparing for technical interviews or looking to strengthen their fundamental computer science knowledge. We will cover arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.',
    hostId: 'mentor1',
    hostName: 'Dr. Code Alchemist',
    hostProfileImageUrl: 'https://placehold.co/100x100.png',
    date: 'November 5th, 2024 at 4:00 PM PST',
    tags: ['DSA', 'Coding Interview', 'Algorithms', 'Problem Solving', 'Data Structures'],
    imageUrl: 'https://placehold.co/600x400.png',
    participantCount: 8,
    maxParticipants: 15,
    price: '$25',
    duration: "90 minutes"
  },
  {
    id: 'gs2',
    title: 'Startup Pitch Practice & Feedback',
    description: 'Refine your startup pitch in a supportive group environment. Get constructive feedback from peers and an experienced entrepreneur. Learn how to structure your pitch, tell a compelling story, and answer tough questions from investors. Each participant will have a chance to present and receive tailored advice.',
    hostId: 'mentor1',
    hostName: 'Valerie Venture',
    hostProfileImageUrl: 'https://placehold.co/100x100.png',
    date: 'November 12th, 2024 at 10:00 AM PST',
    tags: ['Startup', 'Pitching', 'Entrepreneurship', 'Feedback', 'Business'],
    imageUrl: 'https://placehold.co/600x400.png',
    participantCount: 5,
    maxParticipants: 10,
    price: '$20',
    duration: "2 hours"
  },
  {
    id: 'gs3',
    title: 'Intro to UX Design Principles',
    description: 'A beginner-friendly group session covering the fundamentals of UX design. Learn about user research, persona creation, wireframing, prototyping, and usability testing. We will work through a mini-project to apply these concepts.',
    hostId: 'mentor2',
    hostName: 'Desiree Design',
    hostProfileImageUrl: 'https://placehold.co/100x100.png',
    date: 'November 19th, 2024 at 1:00 PM PST',
    tags: ['UX Design', 'Beginner', 'UI/UX', 'Design Thinking', 'Prototyping'],
    imageUrl: 'https://placehold.co/600x400.png',
    participantCount: 12,
    maxParticipants: 20,
    price: 'Free',
    duration: "75 minutes"
  }
];

// Initial Mock Webinars Data (adapted from suggest-webinars.ts)
const INITIAL_MOCK_WEBINARS: Webinar[] = [
  {
    id: 'web1',
    title: 'The Future of Generative AI',
    description: 'Explore the latest advancements in Generative AI, its applications, and ethical considerations. Led by a leading AI researcher.',
    hostId: 'mentor1', // Example hostId
    speakerName: 'Dr. Lex Futura',
    hostProfileImageUrl: 'https://placehold.co/100x100.png', // Example image
    date: 'November 8th, 2024 at 9:00 AM PST',
    topic: 'Artificial Intelligence',
    imageUrl: 'https://placehold.co/400x250.png',
    duration: '90 minutes'
  },
  {
    id: 'web2',
    title: 'Effective Networking in the Tech Industry',
    description: 'Learn strategies for building meaningful professional connections, both online and offline, to advance your career in tech.',
    hostId: 'mentor2', // Example hostId
    speakerName: 'Connector Carla',
    hostProfileImageUrl: 'https://placehold.co/100x100.png', // Example image
    date: 'November 15th, 2024 at 12:00 PM PST',
    topic: 'Career Development',
    imageUrl: 'https://placehold.co/400x250.png',
    duration: '60 minutes'
  },
  {
    id: 'web3',
    title: 'Demystifying Cloud Computing',
    description: 'A comprehensive overview of cloud computing concepts, services (AWS, Azure, GCP), and how to get started with cloud technologies.',
    hostId: 'mentor1', // Example hostId
    speakerName: 'Prof. Nimbus Stratos',
    hostProfileImageUrl: 'https://placehold.co/100x100.png', // Example image
    date: 'November 22nd, 2024 at 3:00 PM PST',
    topic: 'Cloud Computing',
    imageUrl: 'https://placehold.co/400x250.png',
    duration: '75 minutes'
  }
];


// Mock user data (replace with actual API calls)
export const MOCK_USERS: Record<string, UserProfile> = {
  'mentor@example.com': {
    id: 'mentor1',
    email: 'mentor@example.com',
    name: 'Dr. Eleanor Vance',
    role: 'mentor',
    profileImageUrl: 'https://placehold.co/100x100.png',
    bio: 'Experienced AI researcher with a passion for guiding students. Specializing in Machine Learning and Natural Language Processing.',
    interests: ['AI Ethics', 'Deep Learning', 'Academic Research'],
    expertise: ['Machine Learning', 'NLP', 'Computer Vision'],
    universities: [
      { id: 'uni1-mv', institutionName: 'Stanford University', roleOrDegree: 'PhD in AI', startDate: '2010-09-01', endDate: '2014-06-01', description: 'Focused on novel neural network architectures.' },
      { id: 'uni2-mv', institutionName: 'MIT', roleOrDegree: 'M.S. Computer Science', startDate: '2008-09-01', endDate: '2010-06-01' },
    ],
    companies: [
      { id: 'comp1-mv', institutionName: 'Google AI', roleOrDegree: 'Senior Research Scientist', startDate: '2016-07-01', description: 'Led projects in large language model development.' },
      { id: 'comp2-mv', institutionName: 'OpenAI', roleOrDegree: 'Research Engineer', startDate: '2014-07-01', endDate: '2016-06-30' },
    ],
    yearsOfExperience: 10,
    availabilitySlots: [
      { id: 'slot1', startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 1)).toISOString(), isBooked: false},
      { id: 'slot2', startTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 1)).toISOString(), isBooked: false },
      { id: 'slot3', startTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(new Date().getHours() + 1)).toISOString(), isBooked: false },
      { id: 'slot-past-booked', startTime: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() -1)).setHours(new Date().getHours() + 1)).toISOString(), isBooked: true, bookedByMenteeId: 'mentee1' },
    ]
  } as MentorProfile,
  'mentee@example.com': {
    id: 'mentee1',
    email: 'mentee@example.com',
    name: 'Alex Chen',
    role: 'mentee',
    profileImageUrl: 'https://placehold.co/100x100.png',
    bio: 'Undergraduate student eager to learn about data science and pursue higher education in computer science.',
    interests: ['Data Visualization', 'Python Programming', 'Photography'],
    learningGoals: 'Get into a top M.S. program for Data Science and learn about real-world applications of ML.',
    desiredUniversities: ['Stanford University', 'Carnegie Mellon University'],
    desiredJobRoles: ['Data Scientist', 'Machine Learning Engineer'],
    desiredCompanies: ['Google', 'Meta', 'Netflix'],
  } as MenteeProfile,
   'mentor2@example.com': {
    id: 'mentor2',
    email: 'mentor2@example.com',
    name: 'Dr. Ben Carter',
    role: 'mentor',
    profileImageUrl: 'https://placehold.co/100x100.png',
    bio: 'Product Management expert with 12+ years in tech. Passionate about building great products and mentoring future leaders.',
    interests: ['Product Strategy', 'User Experience', 'Startups'],
    expertise: ['Product Management', 'Agile Development', 'Market Analysis', 'UX Strategy'],
    universities: [{ id: 'uni1-bc', institutionName: 'UC Berkeley', roleOrDegree: 'MBA', startDate: '2006-08-01', endDate: '2008-05-01', description: 'Emphasis on Technology Management.' }],
    companies: [
        { id: 'comp1-bc', institutionName: 'Salesforce', roleOrDegree: 'Director of Product', startDate: '2015-03-01', description: 'Led product strategy for key cloud services.' },
        { id: 'comp2-bc', institutionName: 'Adobe', roleOrDegree: 'Senior Product Manager', startDate: '2010-06-01', endDate: '2015-02-28', description: 'Managed flagship creative software products.' }
    ],
    yearsOfExperience: 12,
    availabilitySlots: [
      { id: 'slot4', startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 2)).toISOString(), isBooked: false },
      { id: 'slot5', startTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 2)).toISOString(), isBooked: false },
    ]
  } as MentorProfile,
};

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  completeProfile: (profileData: Partial<UserProfile>, role: UserRole) => void;
  getScheduledSessionsForCurrentUser: () => Promise<EnrichedBooking[]>;
  confirmBooking: (mentorEmail: string, slotId: string) => Promise<void>;
  updateMentorAvailability: (mentorId: string, newSlots: AvailabilitySlot[]) => Promise<void>;
  bookingsVersion: number;
  // Group Session Management
  masterGroupSessionsList: GroupSession[];
  sessionsVersion: number;
  createGroupSession: (sessionData: Omit<GroupSession, 'id' | 'hostId' | 'participantCount' | 'hostName' | 'hostProfileImageUrl' | 'duration'> & { duration?: string }) => Promise<GroupSession>;
  getGroupSessionsByMentor: (mentorId: string) => Promise<GroupSession[]>;
  getGroupSessionDetails: (sessionId: string) => Promise<GroupSession | undefined>;
  deleteMentorGroupSession: (sessionId: string) => Promise<void>;
  getAllGroupSessions: () => Promise<GroupSession[]>;
  // Webinar Management
  masterWebinarsList: Webinar[];
  webinarsVersion: number;
  createWebinar: (webinarData: Omit<Webinar, 'id' | 'hostId' | 'hostProfileImageUrl' | 'speakerName'> & { speakerName?: string }) => Promise<Webinar>;
  getWebinarsByMentor: (mentorId: string) => Promise<Webinar[]>;
  getWebinarDetails: (webinarId: string) => Promise<Webinar | undefined>;
  deleteMentorWebinar: (webinarId: string) => Promise<void>;
  getAllWebinars: () => Promise<Webinar[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingsVersion, setBookingsVersion] = useState(0);
  const [sessionsVersion, setSessionsVersion] = useState(0);
  const [webinarsVersion, setWebinarsVersion] = useState(0);
  const [masterGroupSessionsList, setMasterGroupSessionsList] = useState<GroupSession[]>([]);
  const [masterWebinarsList, setMasterWebinarsList] = useState<Webinar[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('vedkarn-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.email === 'string') {
          if (MOCK_USERS[parsedUser.email]) {
            const mockUserDataFromDB = MOCK_USERS[parsedUser.email];
            const mergedUser = { ...mockUserDataFromDB, ...parsedUser };

            if (mergedUser.role === 'mentor' && !(mergedUser as MentorProfile).availabilitySlots) {
              (mergedUser as MentorProfile).availabilitySlots = (mockUserDataFromDB as MentorProfile)?.availabilitySlots || [];
            }
            setUser(mergedUser);
          } else {
            setUser(parsedUser);
            MOCK_USERS[parsedUser.email] = parsedUser;
          }
        } else {
          localStorage.removeItem('vedkarn-user');
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('vedkarn-user');
      }
    }

    const storedSessions = localStorage.getItem('vedkarn-group-sessions');
    if (storedSessions) {
        try {
            const parsedSessions: GroupSession[] = JSON.parse(storedSessions);
            const initialSessionIds = new Set(INITIAL_MOCK_GROUP_SESSIONS.map(s => s.id));
            const combinedSessions = [...INITIAL_MOCK_GROUP_SESSIONS.filter(s => !parsedSessions.find(ps => ps.id === s.id)), ...parsedSessions];
            setMasterGroupSessionsList(combinedSessions);
        } catch (e) {
            console.error("Failed to parse group sessions from localStorage", e);
            setMasterGroupSessionsList(INITIAL_MOCK_GROUP_SESSIONS);
            localStorage.setItem('vedkarn-group-sessions', JSON.stringify(INITIAL_MOCK_GROUP_SESSIONS));
        }
    } else {
         setMasterGroupSessionsList(INITIAL_MOCK_GROUP_SESSIONS);
         localStorage.setItem('vedkarn-group-sessions', JSON.stringify(INITIAL_MOCK_GROUP_SESSIONS));
    }

    const storedWebinars = localStorage.getItem('vedkarn-webinars');
    if (storedWebinars) {
        try {
            const parsedWebinars: Webinar[] = JSON.parse(storedWebinars);
            const initialWebinarIds = new Set(INITIAL_MOCK_WEBINARS.map(w => w.id));
            const combinedWebinars = [...INITIAL_MOCK_WEBINARS.filter(w => !parsedWebinars.find(pw => pw.id === w.id)), ...parsedWebinars];
            setMasterWebinarsList(combinedWebinars);
        } catch (e) {
            console.error("Failed to parse webinars from localStorage", e);
            setMasterWebinarsList(INITIAL_MOCK_WEBINARS);
            localStorage.setItem('vedkarn-webinars', JSON.stringify(INITIAL_MOCK_WEBINARS));
        }
    } else {
         setMasterWebinarsList(INITIAL_MOCK_WEBINARS);
         localStorage.setItem('vedkarn-webinars', JSON.stringify(INITIAL_MOCK_WEBINARS));
    }

    setLoading(false);
  }, []);

   useEffect(() => {
    if(!loading && masterGroupSessionsList.length > 0) {
        localStorage.setItem('vedkarn-group-sessions', JSON.stringify(masterGroupSessionsList));
    }
  }, [masterGroupSessionsList, loading]);

  useEffect(() => {
    if(!loading && masterWebinarsList.length > 0) {
        localStorage.setItem('vedkarn-webinars', JSON.stringify(masterWebinarsList));
    }
  }, [masterWebinarsList, loading]);


  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith('/auth');
    const isRootPage = pathname === '/';
    const isHowItWorksPage = pathname === '/how-it-works';
    const isApiRoute = pathname.startsWith('/api');


    if (!user && !isAuthPage && !isRootPage && !isHowItWorksPage && !isApiRoute) {
      router.push('/auth/signin');
    } else if (user && !user.role && pathname !== '/auth/complete-profile' && !isApiRoute) {
       router.push('/auth/complete-profile');
    }
  }, [user, loading, router, pathname]);

  const login = async (email: string, initialRole?: UserRole) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    let userToLogin = MOCK_USERS[email];

    if (userToLogin) {
      if (initialRole && userToLogin.role !== initialRole) {
        userToLogin = { ...userToLogin, role: initialRole, name: userToLogin.name || email.split('@')[0] };
        MOCK_USERS[email] = userToLogin;
      } else if (!userToLogin.name && email) {
        userToLogin = { ...userToLogin, name: email.split('@')[0]};
        MOCK_USERS[email] = userToLogin;
      }
      if (userToLogin.role === 'mentor' && !(userToLogin as MentorProfile).availabilitySlots) {
        (userToLogin as MentorProfile).availabilitySlots = (MOCK_USERS[email] as MentorProfile)?.availabilitySlots || [];
      }
    } else {
      const newUserProfile: UserProfile = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        email,
        name: email.split('@')[0],
        role: initialRole || null,
        profileImageUrl: 'https://placehold.co/100x100.png',
        bio: '',
        interests: [],
      };

      if (initialRole === 'mentor') {
        (newUserProfile as Partial<MentorProfile>).expertise = [];
        (newUserProfile as Partial<MentorProfile>).universities = [];
        (newUserProfile as Partial<MentorProfile>).companies = [];
        (newUserProfile as Partial<MentorProfile>).availabilitySlots = [];
        (newUserProfile as Partial<MentorProfile>).yearsOfExperience = 0;
      } else if (initialRole === 'mentee') {
        (newUserProfile as Partial<MenteeProfile>).learningGoals = '';
        (newUserProfile as Partial<MenteeProfile>).desiredUniversities = [];
        (newUserProfile as Partial<MenteeProfile>).desiredJobRoles = [];
        (newUserProfile as Partial<MenteeProfile>).desiredCompanies = [];
      }
      MOCK_USERS[email] = newUserProfile;
      userToLogin = newUserProfile;
    }

    setUser(userToLogin);
    localStorage.setItem('vedkarn-user', JSON.stringify(userToLogin));

    if (!userToLogin.role) {
      router.push('/auth/complete-profile');
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vedkarn-user');
    router.push('/auth/signin');
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    if (user && user.email && MOCK_USERS[user.email]) {
      const updatedUser = { ...MOCK_USERS[user.email], ...profileData };
      MOCK_USERS[user.email] = updatedUser;
      setUser(updatedUser);
      localStorage.setItem('vedkarn-user', JSON.stringify(updatedUser));
    }
  };

  const completeProfile = (profileData: Partial<UserProfile>, role: UserRole) => {
    if (user && user.email && MOCK_USERS[user.email]) {
      let completedProfile: UserProfile = { ...MOCK_USERS[user.email], ...profileData, role };

      if (role === 'mentor') {
        const mentorSpecifics: Partial<MentorProfile> = {
          expertise: (profileData as Partial<MentorProfile>).expertise || (completedProfile as MentorProfile).expertise || [],
          universities: (profileData as Partial<MentorProfile>).universities?.map(exp => ({ ...exp, id: exp.id || `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`})) || (completedProfile as MentorProfile).universities || [],
          companies: (profileData as Partial<MentorProfile>).companies?.map(exp => ({ ...exp, id: exp.id || `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`})) || (completedProfile as MentorProfile).companies || [],
          availabilitySlots: (profileData as Partial<MentorProfile>).availabilitySlots || (completedProfile as MentorProfile).availabilitySlots || [],
          yearsOfExperience: (profileData as Partial<MentorProfile>).yearsOfExperience ?? (completedProfile as MentorProfile).yearsOfExperience ?? 0,
        };
        completedProfile = { ...completedProfile, ...mentorSpecifics, role: 'mentor' };
      } else if (role === 'mentee') {
        const menteeSpecifics: Partial<MenteeProfile> = {
          learningGoals: (profileData as Partial<MenteeProfile>).learningGoals || (completedProfile as MenteeProfile).learningGoals || '',
          desiredUniversities: (profileData as Partial<MenteeProfile>).desiredUniversities || (completedProfile as MenteeProfile).desiredUniversities || [],
          desiredJobRoles: (profileData as Partial<MenteeProfile>).desiredJobRoles || (completedProfile as MenteeProfile).desiredJobRoles || [],
          desiredCompanies: (profileData as Partial<MenteeProfile>).desiredCompanies || (completedProfile as MenteeProfile).desiredCompanies || [],
        };
        completedProfile = { ...completedProfile, ...menteeSpecifics, role: 'mentee' };
      } else {
        completedProfile.role = null;
      }

      MOCK_USERS[user.email] = completedProfile;
      setUser(completedProfile);
      localStorage.setItem('vedkarn-user', JSON.stringify(completedProfile));
      router.push('/dashboard');
    }
  };

  const confirmBooking = useCallback(async (mentorEmail: string, slotId: string): Promise<void> => {
    if (!user || user.role !== 'mentee') {
      throw new Error("Only mentees can book sessions.");
    }
    const menteeId = user.id;
    const mentorToUpdate = MOCK_USERS[mentorEmail] as MentorProfile | undefined;

    if (mentorToUpdate && mentorToUpdate.availabilitySlots) {
      const slotIndex = mentorToUpdate.availabilitySlots.findIndex(s => s.id === slotId);
      if (slotIndex > -1 && !mentorToUpdate.availabilitySlots[slotIndex].isBooked) {
        const updatedSlots = mentorToUpdate.availabilitySlots.map((slot, index) =>
          index === slotIndex ? { ...slot, isBooked: true, bookedByMenteeId: menteeId } : slot
        );
        (MOCK_USERS[mentorEmail] as MentorProfile).availabilitySlots = updatedSlots;

        if (user && user.email === mentorEmail) {
            const updatedCurrentUser = { ...MOCK_USERS[mentorEmail] };
            setUser(updatedCurrentUser);
            localStorage.setItem('vedkarn-user', JSON.stringify(updatedCurrentUser));
        }
        setBookingsVersion(v => v + 1);
        return;
      } else {
        throw new Error("Slot not found or already booked.");
      }
    }
    throw new Error("Mentor not found.");
  }, [user]);


  const getScheduledSessionsForCurrentUser = useCallback(async (): Promise<EnrichedBooking[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!user) return [];

    const scheduledSessions: EnrichedBooking[] = [];
    const allUserProfiles = Object.values(MOCK_USERS);

    for (const profile of allUserProfiles) {
      if (profile.role === 'mentor') {
        const mentorProfile = profile as MentorProfile;
        if (mentorProfile.availabilitySlots) {
          for (const slot of mentorProfile.availabilitySlots) {
            if (slot.isBooked && slot.bookedByMenteeId) {
              if (user.id === mentorProfile.id || user.id === slot.bookedByMenteeId) {
                const menteeProfile = allUserProfiles.find(u => u.id === slot.bookedByMenteeId && u.role === 'mentee') as MenteeProfile | undefined;
                if (menteeProfile) {
                  scheduledSessions.push({
                    id: `${mentorProfile.id}-${slot.id}`,
                    mentorId: mentorProfile.id,
                    menteeId: menteeProfile.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    status: 'confirmed',
                    mentor: mentorProfile,
                    mentee: menteeProfile,
                    sessionTitle: user.role === 'mentor'
                                  ? `Session with ${menteeProfile.name}`
                                  : `Session with ${mentorProfile.name}`,
                    meetingNotes: `Mentorship session: ${mentorProfile.name} & ${menteeProfile.name}. Focus: ${slot.id}`
                  });
                }
              }
            }
          }
        }
      }
    }
    return scheduledSessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [user]);

  const updateMentorAvailability = useCallback(async (mentorId: string, newSlots: AvailabilitySlot[]): Promise<void> => {
    const mentorEmail = Object.keys(MOCK_USERS).find(email => MOCK_USERS[email].id === mentorId);
    if (mentorEmail && MOCK_USERS[mentorEmail] && MOCK_USERS[mentorEmail].role === 'mentor') {
      (MOCK_USERS[mentorEmail] as MentorProfile).availabilitySlots = newSlots;

      if (user && user.id === mentorId) {
        const updatedCurrentUser = { ...MOCK_USERS[mentorEmail] };
        setUser(updatedCurrentUser);
        localStorage.setItem('vedkarn-user', JSON.stringify(updatedCurrentUser));
      }
      setBookingsVersion(v => v + 1);
      return;
    }
    throw new Error("Mentor not found or invalid ID for updating availability.");
  }, [user]);

  // Group Session Management Functions
  const createGroupSession = useCallback(async (
    sessionData: Omit<GroupSession, 'id' | 'hostId' | 'participantCount' | 'hostName' | 'hostProfileImageUrl' | 'duration'> & { duration?: string }
  ): Promise<GroupSession> => {
    if (!user || user.role !== 'mentor') {
      throw new Error("Only mentors can create group sessions.");
    }
    const newSession: GroupSession = {
      ...sessionData,
      id: `gs-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      hostId: user.id,
      hostName: user.name,
      hostProfileImageUrl: user.profileImageUrl,
      participantCount: 0,
      duration: sessionData.duration || "Not specified",
    };
    setMasterGroupSessionsList(prevSessions => [...prevSessions, newSession]);
    setSessionsVersion(v => v + 1);
    return newSession;
  }, [user]);

  const getGroupSessionsByMentor = useCallback(async (mentorId: string): Promise<GroupSession[]> => {
    return masterGroupSessionsList.filter(session => session.hostId === mentorId);
  }, [masterGroupSessionsList]);

  const getGroupSessionDetails = useCallback(async (sessionId: string): Promise<GroupSession | undefined> => {
    return masterGroupSessionsList.find(session => session.id === sessionId);
  }, [masterGroupSessionsList]);

  const getAllGroupSessions = useCallback(async (): Promise<GroupSession[]> => {
    return [...masterGroupSessionsList].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [masterGroupSessionsList]);

  const deleteMentorGroupSession = useCallback(async (sessionId: string): Promise<void> => {
    if (!user || user.role !== 'mentor') {
      throw new Error("User not authorized to delete sessions.");
    }
    const sessionToDelete = masterGroupSessionsList.find(s => s.id === sessionId);
    if (!sessionToDelete) {
        throw new Error("Session not found.");
    }
    if (sessionToDelete.hostId !== user.id) {
      throw new Error("Mentor can only delete their own sessions.");
    }

    setMasterGroupSessionsList(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    setSessionsVersion(v => v + 1);
  }, [user, masterGroupSessionsList]);

  // Webinar Management Functions
  const createWebinar = useCallback(async (
    webinarData: Omit<Webinar, 'id' | 'hostId' | 'hostProfileImageUrl' | 'speakerName'> & { speakerName?: string }
  ): Promise<Webinar> => {
    if (!user || user.role !== 'mentor') {
      throw new Error("Only mentors can create webinars.");
    }
    const newWebinar: Webinar = {
      ...webinarData,
      id: `web-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      hostId: user.id,
      speakerName: webinarData.speakerName || user.name,
      hostProfileImageUrl: user.profileImageUrl,
    };
    setMasterWebinarsList(prevWebinars => [...prevWebinars, newWebinar]);
    setWebinarsVersion(v => v + 1);
    return newWebinar;
  }, [user]);

  const getWebinarsByMentor = useCallback(async (mentorId: string): Promise<Webinar[]> => {
    return masterWebinarsList.filter(webinar => webinar.hostId === mentorId);
  }, [masterWebinarsList]);

  const getWebinarDetails = useCallback(async (webinarId: string): Promise<Webinar | undefined> => {
    return masterWebinarsList.find(webinar => webinar.id === webinarId);
  }, [masterWebinarsList]);

  const getAllWebinars = useCallback(async (): Promise<Webinar[]> => {
    return [...masterWebinarsList].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [masterWebinarsList]);

  const deleteMentorWebinar = useCallback(async (webinarId: string): Promise<void> => {
    if (!user || user.role !== 'mentor') {
      throw new Error("User not authorized to delete webinars.");
    }
    const webinarToDelete = masterWebinarsList.find(w => w.id === webinarId);
     if (!webinarToDelete) {
        throw new Error("Webinar not found.");
    }
    if (webinarToDelete.hostId !== user.id) {
      throw new Error("Mentor can only delete their own webinars.");
    }
    setMasterWebinarsList(prevWebinars => prevWebinars.filter(webinar => webinar.id !== webinarId));
    setWebinarsVersion(v => v + 1);
  }, [user, masterWebinarsList]);


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUserProfile,
      completeProfile,
      getScheduledSessionsForCurrentUser,
      confirmBooking,
      updateMentorAvailability,
      bookingsVersion,
      masterGroupSessionsList,
      sessionsVersion,
      createGroupSession,
      getGroupSessionsByMentor,
      getGroupSessionDetails,
      deleteMentorGroupSession,
      getAllGroupSessions,
      masterWebinarsList,
      webinarsVersion,
      createWebinar,
      getWebinarsByMentor,
      getWebinarDetails,
      deleteMentorWebinar,
      getAllWebinars,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getMockMentorProfiles = (): string[] => {
  return Object.values(MOCK_USERS)
    .filter(u => u.role === 'mentor')
    .map(userProfile => {
      const m = userProfile as MentorProfile;
      const universities = m.universities?.map(u => `${u.roleOrDegree} at ${u.institutionName}`).join('; ') || 'N/A';
      const companies = m.companies?.map(c => `${c.roleOrDegree} at ${c.institutionName}`).join('; ') || 'N/A';
      return `Name: ${m.name}, Bio: ${m.bio || 'N/A'}, Expertise: ${m.expertise?.join(', ') || 'N/A'}, Universities: ${universities}, Companies: ${companies}, Years of Exp: ${m.yearsOfExperience || 0}`;
    });
};

export const getMentorByProfileString = (profileString: string): MentorProfile | undefined => {
  const nameMatch = profileString.match(/Name: (.*?)(?:, Bio:|, Expertise:|$)/);
  if (nameMatch && nameMatch[1]) {
    const name = nameMatch[1].trim();
    const foundUser = Object.values(MOCK_USERS).find(u => u.role === 'mentor' && u.name === name);
    return foundUser ? MOCK_USERS[foundUser.email] as MentorProfile : undefined;
  }
  return undefined;
};
