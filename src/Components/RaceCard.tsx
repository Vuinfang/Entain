import React, { useEffect, useState } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/Hooks'
import { Race } from '@/Services/modules/race'
interface Props {
  defaultIdList: string[]
  idList: string[]
  index: number
  setIdList: React.Dispatch<React.SetStateAction<any>>
  setDefaultIdList: React.Dispatch<React.SetStateAction<any>>
  race: Race
}
// The component of render one race
const RaceCard = (props: Props) => {
  const colors: { [key: string]: string } = {
    '9daef0d7-bf3c-4f50-921d-8e818c60fe61': '#deab8a',
    '161d9be2-e909-4326-8c2c-35ed71fb460b': '#77ac98',
    '4a2788f8-e825-4d36-9894-efd4baf1cfae': '#7bbfea',
  }
  // transfer start time from timestamp to date object
  const startTime = new Date(props.race?.advertised_start?.seconds * 1000)
  // calculate the number of time left
  const calculateTimeLeft = () => {
    if (props.race) {
      const secondsLeft =
        props.race.advertised_start.seconds - new Date().getTime() / 1000
      return Math.round(secondsLeft)
    } else {
      return 0
    }
  }
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  // transfer the number of time left to time format
  const timeTransfer = (rest: number) => {
    const second = Math.floor(rest % 60)
    const minute = Math.floor(rest / 60)
    const hour = minute > 60 ? `${Math.floor(minute / 60)}` : '00'
    return `${hour}:${minute > 9 ? minute : `0${minute}`}:${
      second > 9 ? second : `0${second}`
    }`
  }
  // setInterval for time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [props.race?.advertised_start?.seconds])
  // when race starts 1 min, remove it from id list
  useEffect(() => {
    if (timeLeft < -59) {
      props.setIdList(props.idList.filter(e => e !== props.race.race_id))
      props.setDefaultIdList(
        props.defaultIdList.filter(e => e !== props.race.race_id),
      )
    }
  }, [timeLeft])
  return (
    <View
      style={[
        styles.contentBox,
        { borderLeftColor: colors[props?.race?.category_id], borderLeftWidth: 4 },
      ]}
      key={props.index + props.idList[props.index]}
    >
      <View style={styles.contentSpaceLeft}>
        <View style={styles.contentBar}>
          <Text style={styles.boldText}>Name: &nbsp;</Text>
          <Text>{props.race?.meeting_name}</Text>
        </View>
        <View style={styles.contentBar}>
          <Text style={styles.boldText}>Number: &nbsp;</Text>
          <Text>{props.race?.race_number}</Text>
        </View>
        <View style={styles.contentBar}>
          <Text style={styles.boldText}>Start At: &nbsp;</Text>
          <Text>{`${startTime.getHours()}:${startTime.getMinutes()}`}</Text>
        </View>
      </View>
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.races}>
            {' '}
            {`${timeLeft > 0 ? 'Time left - ' : 'Already started: '}${
              timeLeft > 0 ? timeTransfer(timeLeft) : -timeLeft
            }`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentBox: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contentSpaceLeft: {
    width: '60%',
    height: 80,
    marginLeft: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: 'red'
  },
  contentBar: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
  },
  contentSection: {
    width: '80%',
    height: 20,
    justifyContent: 'center',
    backgroundColor: '#f23232',
  },
  buttonSection: {
    width: '38%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#232323',
  },
  races: {
    color: '#fff',
  },
  boldText: {
    fontSize: 14,
    fontWeight: '700',
  },
})

export default RaceCard
