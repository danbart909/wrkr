import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, FlatList, Input, Text, Select, Stack, Row, Switch } from 'native-base'
import { ActivityIndicator, ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding'
import { getDistance } from 'geolib'
import * as dFNS from 'date-fns'
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class SearchJobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: 'distance',
      sortDirection: 'desc',
      busy: false,
      error: false,
      inputZip: '',
      zipLat: 0,
      zipLng: 0,
      resultsLat: [],
      resultsLng: []
    }
  }

  static contextType = Context

  search = async () => {
    let { fire, zip } = this.context
    let { sortBy, sortDirection, inputZip } = this.state

    if (zip === '') {
      alert('Please Enter a Zip Code')
    } else {
      this.setState({ busy: true, error: false }, async () => {
        let jobs = []
        let { geo } = this.context

        if (inputZip !== '') {
          Geocoder.from(zip)
            .then(x => {
              let lat = x.results[0].geometry.location.lat
              let lng = x.results[0].geometry.location.lng
              this.setState({ inputZip: '', zipLat: lat, zipLng: lng })
              this.context.updateContext('geo', { lat: lat, lng: lng })
              console.log('GPS coordinates for calculating distances retrieved', x.results[0].geometry.location)
            })
            .catch(e => console.log('error', e))
        }

        if (sortBy === 'distance') {
          const rawJobs = await getDocs(collection(fire, 'jobs'))
          rawJobs.forEach((x) => jobs.push(x.data()))
          let newJobs = jobs.filter(value => Object.keys(value).length !== 0)
          jobs = newJobs
          if (sortDirection === 'desc') {
            jobs.sort((a, b) => (getDistance(geo, { lat: a.latitude, lng: a.longitude }) > getDistance(geo, { lat: b.latitude, lng: b.longitude})) ? -1 : 1)
          } else {
            jobs.sort((a, b) => (getDistance(geo, { lat: a.latitude, lng: a.longitude }) > getDistance(geo, { lat: b.latitude, lng: b.longitude})) ? 1 : -1)
          }
        } else {
          const rawJobs = await getDocs(query(collection(fire, 'jobs'), orderBy(sortBy, sortDirection)))
          rawJobs.forEach((x) => jobs.push(x.data()))
        }

        this.context.updateContext('jobSearchResults', jobs)
        this.setState({ busy: false, error: false })
      })
    }
  }

  switchOrder = () => {
    let { sortDirection } = this.state

    sortDirection === 'desc' ? this.setState({ sortDirection: 'asc' }) :
    sortDirection === 'asc' ? this.setState({ sortDirection: 'desc' }) : null
  }

  viewJob = async (x) => {
    await this.context.updateContext('job', x)
    this.context.navigation.navigate('Job View')
  }

  calcDistance = (lat, lng) => {
    let { geo } = this.context
    let geo2 = { lat: lat, lng: lng }
    let meters = getDistance(geo, geo2)
    let feetBig = meters*3.2808
    let feetRounded = Math.round(feetBig*100)/100
    let milesBig = feetBig/5280
    let milesRounded = Math.round(milesBig*100)/100
    let str = ``

    feetRounded < 2000 ?
    str = `${feetRounded} feet away` :
    str = `${milesRounded} miles away`

    return str
  }

  resultsView = () => {
    let { jobSearchResults, user } = this.context
    let { busy, error } = this.state

    if (busy) {
      return (
        <Center mt={hp(25)}>
          <ActivityIndicator size={wp(20)} color='white' />
        </Center>
      )
    }

    if (error) {
      return (
        <Center mt={hp(25)}>
          <Text color='white'>An error occurred, please try again.</Text>
        </Center>
      )
    }
    
    if (jobSearchResults.length) {
      let jobSearchResults2 = []
      jobSearchResults.map(x => {
        let random = String(Math.random())
        let id = random.slice(-10)
        x.id = id
        jobSearchResults2.push(x)
      })
      return (
        <FlatList
          data={jobSearchResults}
          keyExtractor={item => item.id}
          ref={x => this.list = x}
          renderItem={({item, index}) => (
            <Stack
              m={wp(5)}
              bg='white'
              borderRadius='40'
              // borderWidth='1'
            >
              <Row
                // justifyContent='space-between'
                alignItems='flex-start'
                p={wp(2)}
                // borderBottomWidth='1'
              >
                <Center
                  flex='2'
                  py={wp(1)}
                  // borderWidth='1'
                >
                  <Text fontSize={wp(5)}>#{index+1}</Text>
                </Center>
                <Box
                  flex='9'
                  p={wp(1)}
                  // borderWidth='1'
                >
                  <Text fontSize={wp(3.5)}>{item.title}</Text>
                </Box>
                <Box
                  flex='3'
                  p={wp(1)}
                >
                  <Text fontSize={wp(4)} textAlign='right'>${item.tip}</Text>
                </Box>
              </Row>

              <Row
                p={wp(2)}
                justifyContent='space-between'
              >
                <Box
                  alignItems='flex-start'
                >
                  <Text borderBottomWidth='1' pb='2'>Type</Text>
                  <Text>{item.type}</Text>
                </Box>
                <Box
                  alignItems='flex-end'
                >
                  <Text borderBottomWidth='1' pb='2' textAlign='right'>Job Poster</Text>
                  <Text>{item.userName}</Text>
                </Box>
              </Row>

              <Row
                justifyContent='space-between'
                px={wp(2)}
                mb={wp(2)}
              >
                <Text>{`${this.calcDistance(item.latitude, item.longitude)}`}</Text>
                <Text textAlign='right' lineHeight={wp(3.2)}>{item.address.replace(/([,][\s])/, `\n`)}</Text>
              </Row>

              <Row
                justifyContent='space-between'
                px={wp(2)}
                // borderWidth='1'
              >
                <Box
                  flex='1'
                  alignItems='flex-start'
                  // borderWidth='1'
                >
                  <Text borderBottomWidth='1' pb='2'>Creation Date</Text>
                  <Text lineHeight={wp(3.2)}>{item.creationDate.replace(' at', '\nat')}</Text>
                </Box>
                <Box
                  flex='1'
                  alignItems='flex-end'
                  // borderWidth='1'
                >
                  <Text borderBottomWidth='1' pb='2'>Deadline</Text>
                  <Text textAlign='right' lineHeight={wp(3.2)}>{item.endDate.replace(' at', '\nat')}</Text>
                </Box>
              </Row>

              <Center>
                <Button my={wp(1.5)} onPress={() => this.viewJob(item)}>VIEW JOB</Button>
              </Center>
            
            </Stack>
          )}
        />
      )
    }
  }

  render() {
    
    let { zip } = this.context
    let { sortBy, sortDirection, busy, error, zipLat, zipLng } = this.state

    return (
      <>
        <Stack
          bg='coolGray.300'
          py={wp(2)}
          space={wp(2)}
          alignItems='center'
        >
          <Row
            justifyContent='space-evenly'
            w='90%'
            alignItems='center'
          >
            <Text>Zip Code:</Text>
            <Input
              placeholder='e.g. 30102'
              w='75%'
              // my={wp(2)}
              bg='white'
              // borderWidth='1'
              onChangeText={(x) => {
                this.setState({ inputZip: x })
                this.context.updateContext('zip', x)
              }}
              value={zip}
            />
          </Row>

          <Row
            justifyContent='space-evenly'
            w='90%'
            // borderWidth='1'
          >
            <Stack
              alignItems='center'
              // justifyContent='space-between'
              w='50%'
              // borderWidth='1'
            >
              <Box>
                <Text>Sort By:</Text>
              </Box>
              <Box
                w='90%'
                my='auto'
                // borderWidth='1'
              >
                <Select
                  selectedValue={sortBy}
                  accessibilityLabel='Sort By'
                  onValueChange={x => this.setState({ sortBy: x })}
                  w='100%'
                  // variant='underlined'
                  // borderColor='black'
                  bg='coolGray.100'
                  // borderWidth='1'
                >
                  <Select.Item p={wp(3)} label='Distance' value='distance'/>
                  <Select.Item p={wp(3)} label='Tip' value='tip'/>
                  <Select.Item p={wp(3)} label='Created Date' value='creationDate'/>
                  <Select.Item p={wp(3)} label='Ending Date' value='endDate'/>
                </Select>
              </Box>
            </Stack>
            <Stack
              alignItems='center'
              justifyContent='space-between'
              w='50%'
              // borderWidth='1'
            >
              <Box>
                <Text>Order By:</Text>
              </Box>
              <Box
                w='90%'
              >
                <Row
                  justifyContent='space-evenly'
                  px={wp(5)}
                  // borderWidth='1'
                >
                  <Text alignSelf='center'>desc</Text>
                  <Switch
                    // size='sm'
                    marginLeft='0'
                    offTrackColor='green.700'
                    offThumbColor='green.300'
                    onChange={() => this.switchOrder()}
                  />
                  <Text alignSelf='center'>asc</Text>
                </Row>
              </Box>
            </Stack>
          </Row>
  
          <Button
            onPress={() => this.search()}
            // my={wp(2)}
          >SEARCH</Button>
  
        </Stack>

        <Box
          flex='1'
          bg='primary.1'
          // pb={wp(37)}
          borderRightWidth='1'
        >
          {this.resultsView()}
        </Box>
          
        { this.context.jobSearchResults.length >= 3 && <Button
          position='absolute'
          justifyContent='center'
          alignItems='center'
          right={wp(5)}
          bottom={wp(5)}
          boxSize={wp(10)}
          bg='white'
          borderRadius='50'
          borderColor='green.600'
          borderWidth='1'
          // onPress={() => console.log(this.list.getScrollResponder())}
          onPress={() => this.list.scrollToIndex({ index: 0 })}
        >
          <FontAwesomeIcon icon={faArrowUp} size={wp(4)}/>
        </Button> }
      </>
    )
  }
}




// <Box
//               mb={wp(10)}
//               bg='white'
//               borderWidth='1'
//             >
//               <Row
//                 justifyContent='space-between'
//                 alignItems='center'
//                 p={wp(2)}
//                 borderBottomWidth='1'
//               >
//                 <Text fontSize='2xl'>{item.title}</Text>
//                 <Text fontSize='lg'>$ {item.tip}</Text>
//               </Row>
//               <Row
//                 justifyContent='space-between'
//                 alignItems='center'
//                 p={wp(2)}
//                 borderBottomWidth='1'
//               >
//                 <Text fontSize='xs'>Type: {item.type}</Text>
//                 <Text>{item.name}</Text>
//               </Row>
//               <Box
//                 minH='2xs'
//                 maxH='xs'
//                 p={wp(2)}
//                 borderBottomWidth='1'
//               >
//                 <Text fontSize='xs'>{item.description}</Text>
//               </Box>
//               <Row
//                 justifyContent='space-between'
//                 alignItems='center'
//                 p={wp(2)}
//                 borderBottomWidth='1'
//               >
//                 <Text>{item.address.replace(/([,][\s])/, `\n`)}</Text>
//                 <Text>{`${this.calcDistance(item.geo, geo)}`}</Text>
//               </Row>
//               <Row
//                 justifyContent='space-between'
//                 alignItems='center'
//                 p={wp(2)}
//                 borderBottomWidth='1'
//               >
//                 <Stack alignItems='flex-start'>
//                   <Text fontSize='xs'>Created {dFNS.formatDistance(new Date(item.creationDate), new Date(), { addSuffix: true })}</Text>
//                   <Text>{dFNS.format(new Date(item.creationDate), 'EEEE, PPP')}</Text>
//                 </Stack>
//                 <Stack alignItems='flex-end'>
//                   <Text fontSize='xs'>Ending {dFNS.formatDistance(new Date(item.endDate), new Date(), { addSuffix: true })}</Text>
//                   <Text>{dFNS.format(new Date(item.endDate), 'EEEE, PPP')}</Text>
//                 </Stack>
//               </Row>
//               <Center>
//                 <Button
//                   my={wp(4)}
//                   onPress={() => this.viewJob(item)}
//                 >
//                   VIEW JOB
//                 </Button>
//               </Center>
//             </Box>