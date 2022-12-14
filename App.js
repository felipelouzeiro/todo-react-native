import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Alert, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewStask] = useState('');

  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await AsyncStorage.getItem('tasks');

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    }

    saveTasks();
  }, [tasks]);

  async function addNewTask() {
    if(newTask == '') return;
    
    const taskAlreadyExists = tasks.find(task => task === newTask);

    if (taskAlreadyExists) {
      Alert.alert('Atenção!', 'Uma tarefa com esse nome já existe!');
      return;
    }

    setTasks([...tasks, newTask]);

    setNewStask('');
    Keyboard.dismiss();
  }

  async function removeTask(taskToRemove) {
    Alert.alert(
      'Apagar Tarefa',
      'Deseja mesmo deletar essa tarefa?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            setTasks(tasks.filter(task => task !== taskToRemove));
          }
        },
      ],
      { cancelable: false },
    );


  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.Body}>
          <Text>Hello Word!</Text>
          <FlatList
            style={styles.FlatList}
            data={tasks}
            keyExtractor={item => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.ContainerView}>
                <Text style={styles.Text}>{item}</Text>
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialCommunityIcons name='delete-forever' size={24} color='black' />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={styles.Form}>
          <TextInput
            style={styles.Input}
            placeholderTextColor='#999'
            autoCorrect={true} // sugere correção de palavras
            placeholder='Adicione uma nova tarefa'
            maxLength={20}
            onChangeText={text => setNewStask(text)}
            value={newTask}
          />
          <TouchableOpacity
            style={styles.Button}
            onPress={() => addNewTask()}
          >
            <Ionicons name="add" size={24} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  Body: {
    flex: 1,
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor:'#eee',
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10,
  },
  FlatList: {
    flex: 1,
    marginTop: 5,
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#eee",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: "#eee",
  },
  Text: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  }
});
