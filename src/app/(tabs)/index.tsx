import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { useTask } from "@/context/TaskContext";
import TaskModal from "@/components/TaskModal";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

export default function TabOneScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    completed: false,
    id: 0,
  });
  const [selectedValue, setSelectedValue] = useState("option1");
  const [isEdit, setIsEdit] = useState(false);

  const { tasks, fetchTasks, removeTask, toggleTaskCompletion } = useTask();
  const router = useRouter();

  const handleEditTask = (taskId: number) => {
    setIsEdit(true);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditTask(task);
      setIsModalOpen(true);
    }
  };

  const handleDeleteTask = (taskId: number) => {
    removeTask(taskId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDo App!</Text>

      <TouchableOpacity
        onPress={() => setIsModalOpen(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* We will add filters now */}
 <View style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setSelectedValue(itemValue);
          fetchTasks(itemValue); // Fetch tasks based on selected filter
        }}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="In Progress" value="inprogress" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

     </View>

      <View style={styles.taskList}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.taskCard,
                { backgroundColor: item.completed ? "#d4edda" : "#fff" },
              ]}
              onPress={() => router.push(`/ ${item.id}`)}
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  toggleTaskCompletion(item.id);
                }}
                style={{ position: "absolute", right: 80, top: 10 }}
              >
                <Ionicons
                  name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={item.completed ? "#34C759" : "#C7C7CC"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleEditTask(item.id)}
                style={{ position: "absolute", right: 50, top: 10 }}
              >
                <Ionicons name="create-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(item.id)}
                style={{ position: "absolute", right: 10, top: 10 }}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks added yet.</Text>
          }
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          editTask={editTask}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginVertical: 30,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  taskList: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
});
