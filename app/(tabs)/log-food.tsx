import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { env } from '../../src/lib/env';
import { searchFoodWithGemini } from '../../src/lib/gemini';
import { COLORS } from '../../src/lib/theme';
import { PrimaryButton, MonoLabel } from '../../src/lib/ui';

const LOG_METHODS = [
  { mono: 'VOICE', title: 'Voice log', sub: 'Say what you ate', accent: true },
  { mono: 'SCAN', title: 'Meal scanner', sub: 'AI photo recognition', accent: false },
  { mono: 'CODE', title: 'Barcode', sub: 'Packaged foods', accent: false },
  { mono: 'FIND', title: 'Search foods', sub: 'Type or browse', accent: false },
  { mono: 'QUICK', title: 'Quick add', sub: 'Calories or macros', accent: false },
  { mono: 'SAVED', title: 'Saved meals', sub: 'Your favorites', accent: false },
];

const RECENTS = [
  { n: 'Nasi lemak ayam', t: 'Yesterday', k: 680 },
  { n: 'Greek yogurt + berries', t: '2 days ago', k: 260 },
  { n: 'Teh tarik (kurang manis)', t: '2 days ago', k: 180 },
];

export default function LogFoodScreen() {
  const router = useRouter();
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${searchQuery}%`)
      .limit(20);
    if (data) setResults(data);
    setLoading(false);
  }

  async function handleAiSearch() {
    if (!env.EXPO_PUBLIC_GEMINI_API_KEY) {
      Alert.alert('Missing API Key', 'Please add your Gemini API Key to the .env file.');
      return;
    }
    setAiLoading(true);
    try {
      const aiNutrition = await searchFoodWithGemini(searchQuery, env.EXPO_PUBLIC_GEMINI_API_KEY);
      const { data: foodData, error: foodError } = await supabase
        .from('foods')
        .insert({
          name: aiNutrition.name,
          serving_size: aiNutrition.serving_size,
          grams: aiNutrition.grams,
          calories: aiNutrition.calories,
          protein: aiNutrition.protein,
          carbs: aiNutrition.carbs,
          fat: aiNutrition.fat,
          region: aiNutrition.region,
          source: 'ai_generated',
          verification_status: 'ai_generated',
        })
        .select()
        .single();
      if (foodError) throw foodError;
      await supabase.from('ai_generated_foods').insert({
        original_query: searchQuery,
        food_id: foodData.id,
        confidence_score: aiNutrition.confidence_score,
        ai_provider: 'gemini',
      });
      setResults([foodData, ...results]);
    } catch (e: any) {
      Alert.alert('AI Generation Failed', e.message || 'An error occurred.');
    }
    setAiLoading(false);
  }

  const handleMethod = (mono: string) => {
    if (mono === 'FIND') {
      setActiveMethod('FIND');
    } else {
      setActiveMethod(mono);
    }
  };

  if (activeMethod === 'FIND') {
    return (
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <Pressable onPress={() => setActiveMethod(null)} style={styles.closeBtn}>
            <Ionicons name="close" size={16} color={COLORS.ink} />
          </Pressable>
          <Text style={styles.searchTitle}>Add to lunch</Text>
          <Pressable onPress={() => setActiveMethod(null)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.ink} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={COLORS.inkDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          <Pressable onPress={handleSearch} style={styles.micBtn}>
            <Ionicons name="mic-outline" size={14} color={COLORS.ink} />
          </Pressable>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.ink} />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 8 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.resultRow}>
                <View style={styles.resultThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultSub}>
                    {item.serving_size} · {item.protein}g protein
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.resultKcal}>{item.calories}</Text>
                  <Text style={styles.resultKcalUnit}>kcal</Text>
                </View>
                <View style={styles.resultAddBtn}>
                  <Ionicons name="add" size={10} color={COLORS.ink} />
                </View>
              </View>
            )}
            ListEmptyComponent={
              searched ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Nothing found for "{searchQuery}"
                  </Text>
                  <View style={styles.aiCta}>
                    <View style={styles.aiCtaIcon}>
                      <Text style={{ color: COLORS.ink, fontWeight: '700' }}>✦</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiCtaTitle}>Can't find it? Ask Zyra AI.</Text>
                      <Text style={styles.aiCtaSub}>
                        We'll estimate macros from trusted sources.
                      </Text>
                    </View>
                    <Pressable onPress={handleAiSearch} disabled={aiLoading}>
                      <Text style={{ color: COLORS.green, fontWeight: '700' }}>
                        {aiLoading ? '...' : '→'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null
            }
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hubHeader}>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={16} color={COLORS.ink} />
        </Pressable>
        <Text style={styles.hubTitle}>Log a meal</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.hubIntro}>
        <MonoLabel>How would you like to log?</MonoLabel>
        <Text style={styles.hubSubtitle}>Pick your method.</Text>
      </View>

      {/* 2-column method grid */}
      <View style={styles.methodGrid}>
        {LOG_METHODS.map((m) => (
          <Pressable
            key={m.mono}
            onPress={() => handleMethod(m.mono)}
            style={[styles.methodCard, m.accent && styles.methodCardAccent]}
          >
            <View style={[styles.methodIcon, m.accent && styles.methodIconAccent]}>
              <Text style={styles.methodMono}>{m.mono}</Text>
            </View>
            <View style={{ marginTop: 'auto' as any }}>
              <Text style={[styles.methodTitle, m.accent && styles.methodTitleAccent]}>
                {m.title}
              </Text>
              <Text style={[styles.methodSub, m.accent && styles.methodSubAccent]}>
                {m.sub}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* recents */}
      <View style={styles.recentsSection}>
        <MonoLabel>Recent</MonoLabel>
        <View style={styles.recentsList}>
          {RECENTS.map((r, i) => (
            <View key={i} style={styles.recentRow}>
              <View style={styles.recentThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recentName}>{r.n}</Text>
                <Text style={styles.recentTime}>{r.t}</Text>
              </View>
              <Text style={styles.recentKcal}>{r.k}</Text>
              <View style={styles.recentAdd}>
                <Ionicons name="add" size={10} color={COLORS.ink} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingBottom: 100,
  },
  hubHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
  hubIntro: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  hubSubtitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.ink,
    marginTop: 4,
  },
  methodGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodCard: {
    width: '47%',
    aspectRatio: 1 / 0.95,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: 'space-between',
  },
  methodCardAccent: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconAccent: {
    backgroundColor: COLORS.green,
  },
  methodMono: {
    fontFamily: 'monospace' as any,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: COLORS.ink,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.ink,
  },
  methodTitleAccent: {
    color: '#fff',
  },
  methodSub: {
    fontSize: 12,
    color: COLORS.inkDim,
    marginTop: 2,
  },
  methodSubAccent: {
    color: 'rgba(255,255,255,0.55)',
  },
  recentsSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 10,
  },
  recentsList: {
    marginTop: 8,
    gap: 6,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  recentThumb: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F1F2',
  },
  recentName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink,
  },
  recentTime: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
  recentKcal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink,
  },
  recentAdd: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search view styles
  searchHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: COLORS.ink,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blue,
  },
  searchBar: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.ink,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.ink,
  },
  micBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 6,
  },
  resultThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F1F2',
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  resultSub: {
    fontSize: 11,
    color: COLORS.inkDim,
    marginTop: 2,
  },
  resultKcal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  resultKcalUnit: {
    fontSize: 10,
    color: COLORS.inkDim,
  },
  resultAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 8,
    gap: 14,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.inkDim,
    textAlign: 'center',
  },
  aiCta: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiCtaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCtaTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  aiCtaSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
});
