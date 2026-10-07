import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const [reminderType, setReminderType] = useState('1 Hour');

  const addTask = () => {
    if (inputText.trim() === '') return;

    const reminderTime = new Date();
    if (reminderType === '1 Hour') reminderTime.setHours(reminderTime.getHours() + 1);
    else if (reminderType === '3 Hours') reminderTime.setHours(reminderTime.getHours() + 3);
    else if (reminderType === 'Tomorrow') reminderTime.setDate(reminderTime.getDate() + 1);

    const newTask = {
      id: Date.now().toString(),
      title: inputText,
      priority,
      status: 'Pending',
      reminder: reminderTime,
    };

    setTasks([...tasks, newTask]);
    setInputText('');
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newStatus = 'Pending';
        if (task.status === 'Pending') newStatus = 'In Progress';
        else if (task.status === 'In Progress') newStatus = 'Completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case 'High': return '#FF5C5C';
      case 'Medium': return '#FFB347';
      case 'Low': return '#77DD77';
      default: return '#FFF';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return 'circle-outline';
      case 'In Progress': return 'dots-horizontal-circle-outline';
      case 'Completed': return 'check-circle';
      default: return 'circle-outline';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity onPress={() => toggleTaskStatus(item.id)} style={styles.statusToggle}>
        <MaterialCommunityIcons 
          name={getStatusIcon(item.status)} 
          size={28} 
          color={item.status === 'Completed' ? '#77DD77' : '#B0B3B8'} 
        />
      </TouchableOpacity>
      
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, item.status === 'Completed' && styles.taskCompleted]}>
          {item.title}
        </Text>
        <View style={styles.taskMeta}>
          <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
          <Text style={styles.dateText}>
            Due at {item.reminder.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={24} color="#FF5C5C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Tasks</Text>
        <Text style={styles.headerSubtitle}>{tasks.filter(t => t.status === 'Completed').length} / {tasks.length} Completed</Text>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsRow}>
          <TouchableOpacity 
            style={[styles.optionBtn, { borderColor: getPriorityColor(priority), marginRight: 10 }]} 
            onPress={() => {
              const next = priority === 'Low' ? 'Medium' : priority === 'Medium' ? 'High' : 'Low';
              setPriority(next);
            }}
          >
            <Text style={{ color: getPriorityColor(priority), fontWeight: '600' }}>
              {priority} Priority
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionBtn, { borderColor: '#A0A0A0' }]} 
            onPress={() => {
              const next = reminderType === '1 Hour' ? '3 Hours' : reminderType === '3 Hours' ? 'Tomorrow' : '1 Hour';
              setReminderType(next);
            }}
          >
            <Ionicons name="alarm-outline" size={18} color="#FFF" style={{marginRight: 6}} />
            <Text style={{ color: '#FFF', fontWeight: '600' }}>
              {reminderType}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterBtn: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
  },
  filterBtnActive: {
    backgroundColor: '#6C5CE7',
  },
  filterText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  statusToggle: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
    marginBottom: 6,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#121212',
  },
  dateText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 12,
  },
  addBtn: {
    backgroundColor: '#6C5CE7',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  }
});
