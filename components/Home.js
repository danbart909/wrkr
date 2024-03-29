import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Animated, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Box, Button, Flex, Heading, Row, ScrollView, Stack, Text, Center, Divider, Factory } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import firebase from '../config/firebase'
import { collection, doc, getDoc, getDocs, query, orderBy, where, deleteDoc } from 'firebase/firestore'
import { format, isBefore, sub } from 'date-fns'
import { Video, AVPlaybackStatus } from 'expo-av'
import * as SplashScreen from 'expo-splash-screen'
import { LinearGradient } from 'expo-linear-gradient'

// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faCalendarAlt, faExclamationCircle, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'

// const Cycle = (props) => {
//   const TxtCycl = Factory(TextCycle)
//   return <TxtCycl {...props} />
// }

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFadeValue: new Animated.Value(0)
    }
  }

  static contextType = Context

  // componentDidMount() {
  //   SplashScreen.preventAutoHideAsync();
  //   setTimeout(SplashScreen.hideAsync, 10000);
  // }

  oldJobDeleter = async () => {
    let { fire } = this.context
    let jobs1 = [], ids = []
    let cutoff = sub(new Date(), { days: 3 })

    let jobs2 = await getDocs(collection(fire, 'jobs'))
    jobs2.forEach((x) => {
      let data = x.data()
      data.id = x.id
      jobs1.push(data)
    })
    let jobs3 = jobs1.filter(x => Object.keys(x).length > 1)
    jobs3.map(x => { if (isBefore(new Date(x.endDate.seconds*1000), cutoff)) { ids.push(x.id) } })

    console.log(ids)

    ids.map(async x => {
      await deleteDoc(doc(fire, 'jobs', x))
        .then(async () => console.log('delete successful'))
        .catch(e => console.log('delete error', e, e.message))
    })
  }

  textSwitcher = () => {
    let { textFadeValue } = this.state
    let texts = ['Apples', 'Bananas', 'Oranges', 'Limes']

    return <WText>Hungry for <WText opacity={textFadeValue}>{texts}</WText></WText>
  }

  render() {

    let { navigation } = this.context
    let cycleText = ['Burritos', 'Tacos', 'Chalupas', 'Gordidos', 'Tostidos', 'Churros']
    let userName = () => {
      let { name } = this.context.user
      if (name) {
        return <Box alignSelf='center' w='75%' bg='white' borderRadius='30' mb={wp(1)}>
          <Text pt={wp(1)} color='primary.1' textAlign='center' fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(4)}>Signed in as: {name}</Text>
        </Box>
      } else { null }
    }
    let userButton = () => {
      let { appState, navigation } = this.context
      let destination = appState.loggedIn ? 'Create Job' : 'Preface'
      let buttonText = appState.loggedIn ? 'Create a Job' : 'Sign Up'
      return (
        <Button
          w={'75%'}
          bg='primary.100'
          onPress={() => navigation.navigate(destination)}
        >{buttonText}</Button>
      )
    }

    return (
      <ScrollView bg='primary.1'>
        <Center
          mb={wp(5)}
          w='100%'
        >
          <Center
            w='100%'
            bg='white'
          >
            <Text
              fontSize={wp(38)}
              fontFamily='CabinSketch'
              color='primary.1'
              my={wp(-10)}
              onPress={() => {
                // console.log('press', Platform.OS)
                // this.context.navigation.navigate('Preface')
                // this.context.test()
                // this.oldJobDeleter()
                // this.context.logout()
              }}
            >wrkr</Text>
          </Center>

          <Stack
            w='100%'
            pt={wp(3)}
            px={wp(5)}
            space={wp(2)}
          >
            <WText
              position='absolute'
              right={wp(1)}
              fontSize={Platform.OS === 'ios' ? wp(4) : wp(3) }
              onPress={() => this.oldJobDeleter()}
            >v1.5.2</WText>
            {userName()}
            {/* <WText fontSize={wp(5)} textAlign='center'></WText> */}
            <WText fontSize={wp(5)} textAlign='center'>Looking for some work?</WText>
            <WText fontSize={wp(5)} textAlign='center'>Need help with some work?</WText>
            <WText fontSize={wp(5)} textAlign='center'>Let's help each other out!</WText>
          </Stack>
        </Center>

        <Stack
          px={wp(5)}
          pb={wp(6)}
        >
          <Row
            flex='1'
            alignItems='center'
            justifyContent='space-evenly'
          >
            <Box flex='1'>
              <WText textAlign='center'>Find Community Help</WText>
            </Box>
            <Center flex='1'>
              {userButton()}
            </Center>
          </Row>
          <Box
            flex='1'
            alignItems='center'
          >
            <WText>or</WText>
          </Box>
          <Row
            // flex='1'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box flex='1'>
              <WText textAlign='center'>Find Community Work</WText>
            </Box>
            <Center flex='1'>
              <Button
                w={'75%'}
                bg='primary.100'
                onPress={() => this.context.navigation.navigate('Search Jobs')}
              >Search Jobs</Button>
            </Center>
          </Row>
        </Stack>

        <Row
          bg='white'
          p={wp(3)}
          space={wp(5)}
          justifyContent='space-evenly'
        >
          <Button
            flex='1'
            bg='primary.100'
            justifyContent='center'
            onPress={() => this.context.navigation.navigate('Info')}
          >How To Use This App</Button>
          <Button
            flex='1'
            bg='primary.100'
            onPress={() => this.context.navigation.navigate('About')}
          >What is this App About?
          </Button>
        </Row>

        <Stack
          p={wp(5)}
          space={wp(4)}
        >
          <WText>With wrkr, anybody can create a job and it will be visible to anyone who is willing to help. We do not employ any workers ourselves and it exists purely as a convient way to help foster connections in the community. If you have a job that needs doing (mow a lawn, babysit, skim a pool), post it here and you may just find there are plenty of people out there who want to help. For more information, please press one of the buttons above.</WText>
        </Stack>

        <Stack
          p={wp(5)}
          space={wp(5)}
          bg='white'
        >
          <Text textAlign='center' fontSize={wp(7)}>Developer Notes v1.5.2</Text>
          <Text>-</Text>
        </Stack>

        <Stack
          mt={wp(4)}
          p={wp(4)}
        >
      </Stack>

      </ScrollView>
    );
  }
}

let WText = (props) => {
  return <Text color='white' {...props}>{props.children}</Text>
}