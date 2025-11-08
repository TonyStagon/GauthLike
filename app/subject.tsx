import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SUBJECTS = [
  'Math',
  'Biology',
  'Physics',
  'Chemistry',
  'History',
  'Geography',
  'English',
  'Literature',
  'Computer Science',
  'Economics',
];

export default function SubjectScreen() {
  const params = useLocalSearchParams();
  const { imageUri, cropX, cropY, cropWidth, cropHeight } = params;

  const handleSubjectSelect = (subject: string) => {
    console.log('Selected subject:', subject);
    console.log('Crop data:', { cropX, cropY, cropWidth, cropHeight });
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Subject</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.previewContainer}>
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>ab +6 -2a -3b</Text>
        </View>
        <Text style={styles.stateText}>state</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>What is the question{'\n'}related to?</Text>

        <ScrollView style={styles.subjectList} showsVerticalScrollIndicator={false}>
          {SUBJECTS.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subjectButton}
              onPress={() => handleSubjectSelect(subject)}>
              <Text style={styles.subjectButtonText}>{subject}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  placeholder: {
    width: 28,
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1A1A1A',
  },
  previewBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#333',
    marginBottom: 16,
  },
  previewText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  stateText: {
    fontSize: 16,
    color: '#888',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  subjectList: {
    flex: 1,
  },
  subjectButton: {
    backgroundColor: '#FFF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectButtonText: {
    fontSize: 17,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
});
