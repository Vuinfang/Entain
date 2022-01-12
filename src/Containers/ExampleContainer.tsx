import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Brand } from '@/Components'
import { ApiResponse, Race } from '@/Services/modules/race'
import RaceCard from '@/Components/RaceCard'

const ExampleContainer = () => {
  // id list to record all id of race
  const [idList, setIdList] = useState<string[]>([])
  // default Id list for category filter
  const [defaultIdList, setDefaultIdList] = useState<string[]>([])
  const [category, setCategory] = useState<string[]>([
    '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    '161d9be2-e909-4326-8c2c-35ed71fb460b',
    '4a2788f8-e825-4d36-9894-efd4baf1cfae',
  ])
  const addOrRemoveCategoryId = (id: string) => {
    if (category.includes(id)) {
      setCategory(category.filter(e => e !== id))
    } else {
      setCategory([id, ...category])
    }
  }
  // the race detail
  const [races, setRaces] = useState<{ [key: string]: Race }>({})
  // the useEffect will check the length of id list,
  // if it smaller than 5, then fetch again to get 10 races,
  // it will sort the list by start time ascending
  useEffect(() => {
    if (defaultIdList.length < 5) {
      fetch(
        'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
        {
          method: 'GET',
        },
      )
        .then(res => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            const list = res.data.next_to_go_ids
            list.sort(
              (a: string, b: string) =>
                res.data.race_summaries[a].advertised_start.seconds -
                res.data.race_summaries[b].advertised_start.seconds,
            )
            setIdList(list)
            setDefaultIdList(list)
            setRaces(res.data.race_summaries)
          }
        })
    }
  }, [defaultIdList])
  // for category filter
  useEffect(() => {
    if (defaultIdList.length > 0) {
      if (category.length === 3) {
        setIdList(defaultIdList)
      } else {
        setIdList(
          defaultIdList.filter(id => category.includes(races[id].category_id)),
        )
      }
    }
  }, [category])
  return (
    <View>
      <View style={styles.box}>
        <View style={styles.bannerBox}>
          <Text style={styles.companyName}>Ladbrokes</Text>
        </View>
        <View style={styles.topicBox}>
          <Text style={styles.boardName}>Next To Go</Text>
        </View>
        <View style={styles.naviBox}>
          <View style={styles.scrollBar}>
            <TouchableOpacity
              onPress={() =>
                addOrRemoveCategoryId('9daef0d7-bf3c-4f50-921d-8e818c60fe61')
              }
              style={
                category.includes('9daef0d7-bf3c-4f50-921d-8e818c60fe61')
                  ? styles.naviBarClick
                  : styles.naviBar
              }
            >
              <Text style={[styles.races]}>Greyhound</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                addOrRemoveCategoryId('161d9be2-e909-4326-8c2c-35ed71fb460b')
              }
              style={
                category.includes('161d9be2-e909-4326-8c2c-35ed71fb460b')
                  ? styles.naviBarClick
                  : styles.naviBar
              }
            >
              <Text style={styles.races}>Harness</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                addOrRemoveCategoryId('4a2788f8-e825-4d36-9894-efd4baf1cfae')
              }
              style={
                category.includes('4a2788f8-e825-4d36-9894-efd4baf1cfae')
                  ? styles.naviBarClick
                  : styles.naviBar
              }
            >
              <Text style={styles.races}>Horse</Text>
            </TouchableOpacity>
          </View>
          {/* Map list to render the detail, only render top 5 */}
          {idList.map((id, index) => {
            if (index < 5) {
              return (
                <RaceCard
                  key={index}
                  defaultIdList={defaultIdList}
                  setDefaultIdList={setDefaultIdList}
                  idList={idList}
                  setIdList={setIdList}
                  race={races[id]}
                  index={index}
                />
              )
            }
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bannerBox: {
    width: '100%',
    height: 80,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  boardName: {
    fontSize: 18,
    fontWeight: '700',
  },
  topicBox: {
    width: '96%',
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    // backgroundColor: '#f32',
  },
  naviBox: {
    width: '96%',
    height: 500,
    borderRadius: 15,
    // backgroundColor: '#f32',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  scrollBar: {
    width: '100%',
    height: 40,
    // backgroundColor: '#232323',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  naviBarClick: {
    width: '33%',
    height: 40,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  naviBar: {
    width: '33%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#232323'
  },
  races: {
    color: '#fff',
    fontSize: 16,
  },
  box: {
    backgroundColor: '#fff',
    // flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
  },
})

export default ExampleContainer
