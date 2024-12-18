import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import ControleScreen from './screens/ControleScreen';
import HistoricoControleScreen from './screens/HistoricoControleScreen';
import LoggingScreen from './screens/LoggingScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === 'Controle') {
              iconName = require('./assets/controle.png');
            } else if (route.name === 'Histórico de Controle') {
              iconName = require('./assets/historicocontrole.png');
            } else if (route.name === 'Logging') {
              iconName = require('./assets/logging.png');
            }

            return (
              <Image 
                source={iconName} 
                style={{ 
                  width: 40, 
                  height: 40, 
                }} 
              />
            );
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70, 
            paddingTop: 15,
          },
        })}
      >
        <Tab.Screen
          name="Controle"
          component={ControleScreen}
        />
        <Tab.Screen
          name="Histórico de Controle"
          component={HistoricoControleScreen}
        />
        <Tab.Screen
          name="Logging"
          component={LoggingScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
