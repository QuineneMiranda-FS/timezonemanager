const EditTimeZoneForm = ({ item, onUpdate, onCancel, locations = [] }) => {
  const [name, setName] = useState(item.name);
  const [fullName, setFullName] = useState(item.fullName || "");
  const [cityName, setCityName] = useState(item.cityName || "");

  const handleUpdate = async () => {
    if (!name || !fullName) return;

    const selectedLocation = locations.find(
      (loc) => loc.cityName.toLowerCase() === cityName.toLowerCase(),
    );

    const updatedValues = {
      ...item,
      name,
      fullName,
      cityName: selectedLocation ? selectedLocation.cityName : cityName,
    };

    await onUpdate(item.id, updatedValues);
    onCancel();
  };

  return (
    <View style={styles.editContainer}>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={name}
          onChangeText={setName}
          autoCapitalize="characters"
        />
        <TextInput
          style={[styles.input, { flex: 2 }]}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <TextInput
        style={styles.input}
        value={cityName}
        onChangeText={setCityName}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
