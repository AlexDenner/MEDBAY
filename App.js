import 'react-native-gesture-handler';
import * as React from 'react';
import {AsyncStorage, Text, TextInput, View, StyleSheet, Alert, Picker, Image, TouchableOpacity, SafeAreaView, StatusBar, Switch} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack";
import {UserHome} from "./UserHome";
import {UserInfoScreen} from "./UserInfoScreen";
import {SearchScreen} from "./SearchScreen";
import logo from "./assets/logo.png";
import {DoctorHome} from "./DoctorHome";
import {DoctorInfoScreen} from "./DoctorInfoScreen";
import {DrawerPaziente} from "./drawerpaziente";
import {RegFunction} from "./RegFunction";
import {DrawerDottore} from "./drawerdottore";
import {CreateOfficeScreen} from "./CreateOfficeScreen";
import PrenotationScreen from "./PrenotationScreen";
import {InfoScreen} from "./InfoScreen";
import {PrenotationListScreen} from "./PrenotationListScreen";
import {PrenotationInfoScreen} from "./PrenotationInfoScreen";
import {DocInfoReservationScreen} from "./DocInfoReservationScreen";
import {RecipeScreen} from "./RecipeScreen";
import {ServiceInfoScreen} from "./ServiceInfoScreen";
import {DocServiceInfoScreen} from "./DocServiceInfoScreen";
import {AddServiceScreen} from "./AddServiceScreen";
import {DocPrenotationListScreen} from "./DocPrenotationListScreen";
import {ServicesListScreen} from "./ServicesListScreen";
import {UserServListScreen} from "./UserServListScreen";
import { LinearGradient } from 'expo-linear-gradient';
import {useState} from "react";
import {DoctorListScreen} from "./DoctorListScreen";
import {FilterScreen} from "./FilterScreen";
import {ScannerScreen} from "./ScannerScreen";


const AuthContext = React.createContext();

const AuthStack = createStackNavigator();
const AuthStackScreen = ({navigation}) => (
    <AuthStack.Navigator
        screenOptions={{headerTransparent: true}}
        headerMode = 'none'>
        <AuthStack.Screen name="LogIn" component={LogIn} />
        <AuthStack.Screen name="Registration" component={ RegFunction }  />
    </AuthStack.Navigator>
);



function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image source={logo} style={{width: "60%", height: "31%"}}/>
        </View>
    );
}

function LogIn ({navigation}) {
    let [email, setEmail] = React.useState();
    let [password, setPassword] = React.useState();
    let [selectedValue, setSelectedValue] = React.useState('Paziente');
    const { signIn } = React.useContext(AuthContext);
    const [isEnabled, setIsEnabled] = useState(false);

    const storeData = async (value, value2) => {
        try {
            await AsyncStorage.setItem('userToken', value)
            await AsyncStorage.setItem('login', value2)
        } catch (e) {
            console.log(e);
        }
    }

    function toggleSwitch() {
        setIsEnabled(previousState => !previousState);
        switch (isEnabled) {
            case false: {
                setSelectedValue('Medico');
                break;
            }
            case true: {
                setSelectedValue('Paziente');
                break;
            }
        }
        console.log(isEnabled,selectedValue)
    }

    function signInAlert() {
        Alert.alert(
            'Username or Password not found!',
            ' ',
            [
                { text: "Try Again", onPress: navigation.push("LogIn") }
            ],
            { cancelable: false }
        );
    }

    function loginFunction(user, email, password) {
        fetch('http://medbay.altervista.org/authentification/signIn.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                email: email,
                password: password,
                type: user

            })
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson) {
                    storeData(responseJson, user);
                    signIn();
                } else {
                    signInAlert();
                }
            }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperView}>
                <Image source={logo} style={styles.logoImage}/>
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="e-mail"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setEmail(text)}/>
            </View>
            <View style={styles.inputView} >
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <View style={{flexDirection:'row', marginLeft: "2%"}}>
                <Text style={{fontWeight:'bold',fontSize: 17,color:'#fffff0'}}>User</Text>
                <Switch
                    trackColor={{ false: "#fb5b5a", true: "#fffff0" }}
                    thumbColor={isEnabled ? "#fb5b5a" : "#fffff0"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch()}
                    value={isEnabled}
                />
                <Text style={{fontWeight:'bold',fontSize: 17,color:'#fb5b5a'}}>Doctor</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn}
                              onPress = {()=> loginFunction(selectedValue,email,password)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => navigation.push("Registration")}>
                <Text style={{color:"#fffff0", fontWeight: "bold"}}>SignUp</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4c669f',
        alignItems: 'center',
        //marginTop: StatusBar.currentHeight || 0,
        //justifyContent: 'center',
    },
    upperView: {
        backgroundColor:'#fffff0',
        //height:430,
        height: "50%",
        width:"100%",
        borderBottomStartRadius:38,
        borderBottomEndRadius:38,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:"10%",
        elevation: 5
    },
    logoImage: {
        width: 150,
        height: 150,
        marginTop: "10%"
        //marginBottom: "15%"
    },
    logo:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fb5b5a",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        //height:53,
        height: "5.5%",
        marginBottom:30,
        justifyContent:"center",
        padding:20,
        elevation: 3
    },
    inputText:{
        height:50,
        color:"black"
    },
    loginBtn:{
        width:"60%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        //height:50,
        height: "5.5%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        elevation:3
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    picker:{
        height: 50,
        width: 150
    }
});


const Drawer = createDrawerNavigator();

function UserDrawerContent(props) {
    const { signOut } = React.useContext(AuthContext);

    const filteredProps = {
        ...props,
        state: {
            ...props.state,
            routeNames: props.state.routeNames.filter(
                // To hide single option
                // (routeName) => routeName !== 'HiddenPage1',
                // To hide multiple options you can add & condition
                (routeName) => routeName !== 'DoctorInfo' && routeName !== 'Book' && routeName !== 'PrenotationInfo' && routeName !== 'ServiceInfo' && routeName !== 'Recipe' && routeName !== 'ServiceList' && routeName !== 'DoctorsList' && routeName !== 'Filter'
            ),
            routes: props.state.routes.filter(
                (route) => route.name !== 'DoctorInfo' && route.name !== 'Book' && route.name !== 'PrenotationInfo' && route.name !== 'ServiceInfo' && route.name !== 'Recipe' && route.name !== 'ServiceList' && route.name !== 'DoctorsList' && route.name !== 'Filter'
            ),
        },
    }

    return (
        /*<DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={() => signOut()} />
        </DrawerContentScrollView>*/
        <View style={{flex:1}}>
            <DrawerContentScrollView {...filteredProps}>
                <DrawerPaziente/>
                <DrawerItemList {...filteredProps} />
                <DrawerItem label="Logout" onPress={() => signOut()} />
            </DrawerContentScrollView>
        </View>
    );
}

const UserDrawer = () => (
    <Drawer.Navigator
        initialRouteName="Home"
        drawerType="slide"
        //drawerPosition= "right"
        drawerContent={props => <UserDrawerContent {...props} />}>
        <Drawer.Screen name="Home"
                       component={UserHome}
        />
        <Drawer.Screen name="Info"
                       component={UserInfoScreen}
        />
        <Drawer.Screen name="Search"
                       component={SearchScreen}
        />
        <Drawer.Screen name="DoctorInfo"
                       component={InfoScreen}
        />
        <Drawer.Screen name="Book"
                       component={PrenotationScreen}
        />
        <Drawer.Screen name="Reservations"
                       component={PrenotationListScreen}
        />
        <Drawer.Screen name="PrenotationInfo"
                       component={PrenotationInfoScreen}
        />
        <Drawer.Screen name="Recipe"
                       component={RecipeScreen}
        />
        <Drawer.Screen name="ServiceInfo"
                       component={ServiceInfoScreen}
        />
        <Drawer.Screen name="ServiceList"
                       component={UserServListScreen}
        />
        <Drawer.Screen name="DoctorsList"
                       component={DoctorListScreen}
        />
        <Drawer.Screen name="Filter"
                       component={FilterScreen}
        />
    </Drawer.Navigator>
)

function DoctorDrawerContent(props) {
    const { signOut } = React.useContext(AuthContext);

    const filteredProps = {
        ...props,
        state: {
            ...props.state,
            routeNames: props.state.routeNames.filter(
                // To hide single option
                // (routeName) => routeName !== 'HiddenPage1',
                // To hide multiple options you can add & condition
                (routeName) => routeName !== 'CreateOffice' && routeName !== 'ServiceInfo' && routeName !== 'ReservationInfo' && routeName !== 'Recipe' && routeName !== 'AddSer' && routeName !== 'Scanner'
            ),
            routes: props.state.routes.filter(
                (route) => route.name !== 'CreateOffice' && route.name !== 'ServiceInfo' && route.name !== 'ReservationInfo' && route.name !== 'Recipe' && route.name !== 'AddSer' && route.name !== 'Scanner'
            ),
        },
    }

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...filteredProps}>
                <DrawerDottore/>
                <DrawerItemList {...filteredProps} />
                <DrawerItem label="Logout" onPress={() => signOut()} />
            </DrawerContentScrollView>
        </View>
    );
}



const DoctorDrawer = () => (
    <Drawer.Navigator
        initialRouteName="Home"
        drawerType="slide"
        //drawerPosition= "right"
        drawerContent={props => <DoctorDrawerContent {...props} />}>
        <Drawer.Screen name="ReservationInfo"
                       component={DocInfoReservationScreen}
        />
        <Drawer.Screen name="Scanner"
                       component={ScannerScreen}
        />
        <Drawer.Screen name="Recipe"
                       component={RecipeScreen}
        />
        <Drawer.Screen name="ServiceInfo"
                       component={DocServiceInfoScreen}
        />
        <Drawer.Screen name="AddSer"
                       component={AddServiceScreen}
        />
        <Drawer.Screen name = "Home"
                       component={DoctorHome}
        />
        <Drawer.Screen name = "Info"
                       component={DoctorInfoScreen}
        />
        <Drawer.Screen name="Services"
                       component={ServicesListScreen}
        />
        <Drawer.Screen name = "CreateOffice"
                       component={CreateOfficeScreen}
        />
        <Drawer.Screen name="Reservations"
                       component={DocPrenotationListScreen}
        />
    </Drawer.Navigator>
)

export default function App() {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        userModo: action.modo,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                        userModo: action.modo,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                        userModo: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
            userModo: null,
        }
    );

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;
            let value;
            try {
                value = await AsyncStorage.getItem('userToken');
                if(value !== null){
                    userToken = value;
                }
                else{
                    userToken = null;
                }
            } catch (e) {
                console.log(e);
            }
            let login;
            let value2;
            try {
                value2 = await AsyncStorage.getItem('login');
                if(value2 !== null){
                    login = value2;
                }
                else{
                    login = null;
                }
            } catch (e) {
                console.log(e);
            }
            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken, modo: login});
        };

        bootstrapAsync();
    }, []);

    /*const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userToken')
            if(value !== null) {
                return value
            }
            else {
                return null
            }
        } catch(e) {
            console.log(e);
        }
    }
    const getLogin = async () => {
        try {
            const value = await AsyncStorage.getItem('login')
            if(value !== null) {
                return value
            }
            else {
                return null
            }
        } catch(e) {
            console.log(e);
        }
    }*/

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token
                let value = await AsyncStorage.getItem('userToken')
                let value2 = await AsyncStorage.getItem('login')
                /*const value = getData();
                const value2 = getLogin();*/
                dispatch({type: 'SIGN_IN', token: value, modo: value2});
            },
            signOut: async data => {
                try {
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('login');
                } catch (err) {
                }
                dispatch({type: 'SIGN_OUT'})
            },
            /*signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 0 });
            },*/
        }),
        []
    );

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {state.isLoading ? (
                    // We haven't finished checking for the token yet
                    <SplashScreen />
                ) : state.userToken == null ? (
                    // No token found, user isn't signed in
                    <AuthStackScreen
                        /* options={{
                             // When logging out, a pop animation feels intuitive
                             animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                         }}*/
                    />
                ) : state.userModo === 'Paziente' ? (
                    <UserDrawer />
                ) : (
                    <DoctorDrawer />
                )}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

/*<Image source={logo} style={styles.logoImage}/>
<Text style={styles.logo}> THE ONLY WAY IS MEDBAY </Text>
<View style={styles.inputView} >
    <TextInput
        style={styles.inputText}
        placeholder="e-mail"
        placeholderTextColor="#003f5c"
        onChangeText={text => setEmail(text)}/>
</View>
<View style={styles.inputView} >
    <TextInput
        secureTextEntry
        style={styles.inputText}
        placeholder="Password"
        placeholderTextColor="#003f5c"
        onChangeText={text => setPassword(text)}
    />
</View>
<Picker
    style = {styles.picker}
    selectedValue= {selectedValue}
    onValueChange={(itemValue) => setSelectedValue(itemValue)}
>
    <Picker.Item label="User" value='Paziente'/>
    <Picker.Item label="Private Doctor" value='Medico'/>
</Picker>
<TouchableOpacity style={styles.loginBtn}
                  onPress = {()=> loginFunction(selectedValue,email,password)}>
    <Text style={styles.loginText}>LOGIN</Text>
</TouchableOpacity>
<TouchableOpacity onPress = {() => navigation.push("Registration")}>
    <Text style={{color:"#4169e1", fontWeight: "bold"}}>SignUp</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: "31%",
        height: "16%",
        marginBottom: "15%"
    },
    logo:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fb5b5a",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"black"
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#4169e1",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    picker:{
        height: 50,
        width: 150
    }
});
*/