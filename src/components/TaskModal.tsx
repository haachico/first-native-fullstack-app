import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { useContext, useState } from "react";
import { TaskContext, useTask } from "@/context/TaskContext";
import { task } from "@/types/tasks";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';


type TaskModalProps = {
  onClose: () => void;
  editTask: task; // Optional prop for editing a task
  isEdit: boolean; // Optional prop to indicate if it's an edit operation
  setIsEdit: (isEdit: boolean) => void; // Optional setter for isEdit state
}
const TaskModal: React.FC<TaskModalProps> = ({ onClose, editTask, isEdit, setIsEdit }) => {

  const { tasks, addTask , updateTask } = useTask();
  const [task, setTask] = useState<Omit<task, "completed" | "id">>({
    title: isEdit ? editTask.title : "",
    description: isEdit ? editTask.description : "",
  });
const [image, setImage] = useState<string | null>(null);

const pickImage = async () => {
  // Ask for permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
    return;
  }
  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setImage(result.assets[0].uri);
  }
};

  const handleChange = (name: keyof task, value: string) => {
   
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
    
  };


const handleSaveTask = async () => {
  if (task.title.trim() === "") {
    alert("Title is required");
    return;
  }

  const formData = new FormData();
  formData.append('title', task.title);
  formData.append('description', task.description);
  if (image) {
    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('image', {
      uri: image,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  }

  formData.append('completed', 'false'); // Assuming completed is false by default
  formData.append('id', isEdit ? editTask.id.toString() : Date.now().toString()); // Use current timestamp as ID for new tasks

  // console.log("Form Dataaaa:", JSON.stringify(formData));

  if (isEdit) {
    // Send formData to your backend for updating the task
    // Example:
    updateTask(formData);
  } else {
   addTask(formData);
  }

  setIsEdit(false);
  setTask({ title: "", description: "" });
  setImage(null);
  onClose();
};


  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
      <Text  style={styles.modalTitle}>Add a new task</Text>
      <Text style={styles.label}>Add a task below</Text>
      <TextInput
        placeholder="Enter a new task..."
        style={styles.input}
        value={ task.title}
        onChangeText={(value) => handleChange("title", value)}
      />

      <Text style={styles.label}>Add a description (optional)</Text>

      <TextInput
        placeholder="Enter description..."
        style={styles.textArea}
        value={ task.description}
        onChangeText={(value) => handleChange("description", value)}
        multiline={true}
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
       {
        isEdit ? <Text style={styles.buttonLabel}>Update Task</Text> : <Text style={styles.buttonLabel}>Add Task</Text>
       }
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonLabel}>Close</Text>
      </TouchableOpacity>

    </View>
    <TouchableOpacity style={styles.button} onPress={pickImage}>
  <Text style={styles.buttonLabel}>Pick an Image</Text>
</TouchableOpacity>
{image && (
  <Image
    source={{ uri: image }}
    style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8 }}
  />
)}
    </View>
  );
};

export default TaskModal;

const styles = StyleSheet.create({

  
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark backdrop
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

   modalContainer: {
    backgroundColor: '#1a1a1a', // Dark background
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#ffffff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    backgroundColor: "#fff",
    marginBottom: 20,
    height: 80,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  taskText: {
    color: "#ffffff",
    fontSize: 16,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 16,
    fontStyle: "italic",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
