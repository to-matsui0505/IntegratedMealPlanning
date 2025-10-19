import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { diContainer } from '@/src/infrastructure/di/DIContainer';
import { AzureOpenAIConfig } from '@/src/domain/entities/AzureOpenAIConfig';

/**
 * 設定画面
 * Azure OpenAIの設定を行う
 */
export default function SettingsScreen() {
  const [config, setConfig] = useState<AzureOpenAIConfig>({
    endpoint: '',
    apiKey: '',
    modelName: '',
    apiVersion: '',
    timeoutSeconds: 30,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 設定を読み込む
  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const configRepo = diContainer.getConfigRepository();
      const loadedConfig = await configRepo.getAzureOpenAIConfig();
      setConfig(loadedConfig);
    } catch {
      Alert.alert('エラー', '設定の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 画面がフォーカスされたときに設定を読み込む
  useFocusEffect(
    useCallback(() => {
      loadConfig();
    }, [loadConfig])
  );

  // 設定を保存
  const handleSave = async () => {
    try {
      // バリデーション
      if (!config.endpoint.trim()) {
        Alert.alert('エラー', 'エンドポイントを入力してください');
        return;
      }
      if (!config.apiKey.trim()) {
        Alert.alert('エラー', 'APIキーを入力してください');
        return;
      }
      if (!config.modelName.trim()) {
        Alert.alert('エラー', 'モデル名を入力してください');
        return;
      }
      if (!config.apiVersion.trim()) {
        Alert.alert('エラー', 'APIバージョンを入力してください');
        return;
      }
      if (config.timeoutSeconds <= 0) {
        Alert.alert('エラー', 'タイムアウト時間は1秒以上を指定してください');
        return;
      }

      setIsSaving(true);
      const configRepo = diContainer.getConfigRepository();
      await configRepo.saveAzureOpenAIConfig(config);
      Alert.alert('成功', '設定を保存しました');
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : '設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>設定を読み込み中...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          Azure OpenAI 設定
        </ThemedText>

        <ThemedText style={styles.description}>
          食材撮影の画像解析にAzure OpenAIを使用します。
          {'\n'}以下の項目を設定してください。
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">エンドポイント *</ThemedText>
          <TextInput
            style={styles.input}
            value={config.endpoint}
            onChangeText={(value) => setConfig({ ...config, endpoint: value })}
            placeholder="https://your-resource.openai.azure.com"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ThemedText style={styles.helpText}>
            Azure OpenAIリソースのエンドポイントURL
          </ThemedText>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">APIキー *</ThemedText>
          <TextInput
            style={styles.input}
            value={config.apiKey}
            onChangeText={(value) => setConfig({ ...config, apiKey: value })}
            placeholder="YOUR_API_KEY"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ThemedText style={styles.helpText}>
            Azure OpenAIのアクセスキー
          </ThemedText>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">モデル名 *</ThemedText>
          <TextInput
            style={styles.input}
            value={config.modelName}
            onChangeText={(value) => setConfig({ ...config, modelName: value })}
            placeholder="gpt-4o"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ThemedText style={styles.helpText}>
            デプロイしたモデルの名前（例: gpt-4o, gpt-4-vision-preview）
          </ThemedText>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">APIバージョン *</ThemedText>
          <TextInput
            style={styles.input}
            value={config.apiVersion}
            onChangeText={(value) => setConfig({ ...config, apiVersion: value })}
            placeholder="2024-02-15-preview"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ThemedText style={styles.helpText}>
            Azure OpenAI APIのバージョン
          </ThemedText>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">タイムアウト時間（秒） *</ThemedText>
          <TextInput
            style={styles.input}
            value={config.timeoutSeconds.toString()}
            onChangeText={(value) => {
              const num = parseInt(value, 10);
              setConfig({ ...config, timeoutSeconds: isNaN(num) ? 30 : num });
            }}
            placeholder="30"
            keyboardType="numeric"
          />
          <ThemedText style={styles.helpText}>
            AI解析のタイムアウト時間（推奨: 30-60秒）
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isSaving ? '保存中...' : '設定を保存'}
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            設定方法
          </ThemedText>
          <ThemedText style={styles.infoText}>
            1. Azure Portalでazure OpenAIリソースを作成{'\n'}
            2. ビジョン対応モデル（gpt-4o等）をデプロイ{'\n'}
            3. エンドポイントとキーを上記フォームに入力{'\n'}
            4. 設定を保存してから食材撮影機能をお試しください
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    color: '#666',
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
  helpText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  infoTitle: {
    marginBottom: 12,
  },
  infoText: {
    color: '#666',
    lineHeight: 22,
  },
});
