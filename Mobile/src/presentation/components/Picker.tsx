import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';

interface PickerProps {
  label?: string;
  value: string;
  items: string[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  style?: any;
}

export const Picker: React.FC<PickerProps> = ({
  value,
  items,
  onValueChange,
  placeholder = '選択してください',
  editable = true,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelect = (item: string) => {
    onValueChange(item);
    setModalVisible(false);
    setSearchText('');
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => editable && setModalVisible(true)}
        disabled={!editable}>
        <Text
          style={[
            styles.selectorText,
            !value && styles.placeholderText,
            !editable && styles.disabledText,
          ]}>
          {value || placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>選択してください</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {items.length > 5 && (
              <TextInput
                style={styles.searchInput}
                placeholder="検索..."
                value={searchText}
                onChangeText={setSearchText}
              />
            )}

            <ScrollView style={styles.itemList}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.item,
                    item === value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}>
                  <Text
                    style={[
                      styles.itemText,
                      item === value && styles.selectedItemText,
                    ]}>
                    {item}
                  </Text>
                  {item === value && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
              {filteredItems.length === 0 && (
                <Text style={styles.noResults}>該当なし</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FFF',
    minHeight: 40,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#CCC',
  },
  arrow: {
    fontSize: 10,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  searchInput: {
    margin: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    fontSize: 14,
  },
  itemList: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#E3F2FD',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkMark: {
    fontSize: 18,
    color: '#2196F3',
  },
  noResults: {
    padding: 16,
    textAlign: 'center',
    color: '#999',
  },
});
