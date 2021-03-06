import React from 'react';
import { StyleSheet, View, Button, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios'

import RestaurantList from './src/components/RestaurantList'
import RestaurantDetail from './src/components/RestaurantDetail'
import Header from './src/components/Header'

export default class App extends React.Component {
  state = {
    query: '',
    restaurants: [],
    isLoading: false
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    this.setState({
      isLoading: true
    })
    axios.get(`https://developers.zomato.com/api/v2.1/search?q=${this.state.query}`, {
      headers: {
        'user-key': '026e5a9f7e29e3051efab94483074ea1'
      },
      params: {
        count: 10
      }
    }).then(response => {
      let { restaurants } = response.data
      restaurants = restaurants.map((item:any) => {
        const { restaurant } = item
        return {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.location.address
        }
      })
      this.setState({
        restaurants,
        isLoading: false
      })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header></Header>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={(query) => this.setState({ query })}
        />
        <Button title="search" onPress={()=> this.getData()}></Button>
        {this.state.isLoading &&
          <ActivityIndicator size="large" style={{ justifyContent: 'center', height: 80 }}/>
        }
        {!this.state.isLoading &&
          <RestaurantList items={this.state.restaurants}/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight
  }
})
