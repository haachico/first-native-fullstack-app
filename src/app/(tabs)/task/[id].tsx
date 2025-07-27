import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTask } from "@/context/TaskContext";

const TaskDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const{ tasks } = useTask();


  const task = tasks.find(task => task.id === Number(id));

    if (!task) {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Task Not Found</Text>
        </View>
        );
    }

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Task Details",
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Task Details</Text>
          <Text style={styles.subtitle}>{task.title}</Text>
          <Text style={styles.description}>
           {task.description || "No description provided."}
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskDetailsPage;
