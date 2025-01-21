import { Tabs } from 'expo-router';  
import React from 'react';  
import { Platform } from 'react-native';  
  
import { HapticTab } from '@/components/HapticTab';  
import { IconSymbol } from '@/components/ui/IconSymbol';  
import TabBarBackground from '@/components/ui/TabBarBackground';  
import { Colors } from '@/constants/Colors';  
import { useColorScheme } from '@/hooks/useColorScheme';  
  
export default function TabLayout() {  
    const colorScheme = useColorScheme();  
  
    return (  
        <Tabs  
            screenOptions={{  
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,  
                headerShown: false,  
                tabBarButton: HapticTab,  
                tabBarBackground: TabBarBackground,  
                tabBarStyle: Platform.select({  
                    ios: {  
                        position: 'absolute',  
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',  
                        borderRadius: 15,  
                        marginHorizontal: 10,  
                        shadowColor: '#000',  
                        shadowOffset: { width: 0, height: 2 },  
                        shadowOpacity: 0.25,  
                        shadowRadius: 3.84,  
                        elevation: 5,  
                    },  
                    default: {  
                        backgroundColor: Colors[colorScheme ?? 'light'].background,  
                        borderTopWidth: 0,  
                        elevation: 10,  
                    },  
                }),  
            }}  
        >   
  
            <Tabs.Screen  
                name="index"  
                options={{  
                    title: 'Dashboard',  
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.fill" color={color} />,  
                }}  
            />  
  
            <Tabs.Screen  
                name="profile"  
                options={{  
                    title: 'Profile',  
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,  
                }}  
            />  
        </Tabs>  
    );  
}  
