import { MealPlan } from '@/src/domain/entities/MealPlan';
import { MealPlanItem, MealType } from '@/src/domain/entities/MealPlanItem';
import { AIMealPlanGenerator } from '@/src/application/use-cases/CreateMealPlanUseCase';

/**
 * AI献立生成サービスのモック実装
 * 実際のアプリでは外部AIサービスを使用する予定
 */
export class MockAIMealPlanGenerator implements AIMealPlanGenerator {
  async generateMealPlan(
    ingredients: string[],
    startDate: Date,
    endDate: Date,
    allergens: string[]
  ): Promise<MealPlan> {
    // モック実装: 実際のAI生成の代わりにダミーデータを返す
    console.log('Generating meal plan for ingredients:', ingredients);
    console.log('Allergens:', allergens);

    const items: MealPlanItem[] = [];
    const currentDate = new Date(startDate);
    let itemId = 1;

    // 各日の献立を生成
    while (currentDate <= endDate) {
      // 朝食
      items.push({
        id: `item-${itemId++}`,
        mealPlanId: '',
        date: new Date(currentDate),
        mealType: MealType.BREAKFAST,
        dishName: 'トースト＆サラダ',
        ingredients: ['食パン', 'レタス', 'トマト'],
        recipeText: '食パンをトーストし、レタスとトマトでサラダを作る。',
        estimatedCalories: 300,
        estimatedCost: 200,
        externalRecipeUrl: 'https://example.com/recipe/breakfast',
      });

      // 昼食
      items.push({
        id: `item-${itemId++}`,
        mealPlanId: '',
        date: new Date(currentDate),
        mealType: MealType.LUNCH,
        dishName: 'チキンサラダ',
        ingredients: ['鶏肉', 'レタス', 'にんじん'],
        recipeText: '鶏肉を焼き、野菜と一緒にサラダにする。',
        estimatedCalories: 450,
        estimatedCost: 400,
        externalRecipeUrl: 'https://example.com/recipe/lunch',
      });

      // 夕食
      items.push({
        id: `item-${itemId++}`,
        mealPlanId: '',
        date: new Date(currentDate),
        mealType: MealType.DINNER,
        dishName: '野菜炒め',
        ingredients: ['豚肉', 'にんじん', 'キャベツ'],
        recipeText: '豚肉と野菜を炒める。醤油とみりんで味付け。',
        estimatedCalories: 550,
        estimatedCost: 500,
        externalRecipeUrl: 'https://example.com/recipe/dinner',
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const mealPlanId = `plan-${Date.now()}`;
    items.forEach((item) => {
      item.mealPlanId = mealPlanId;
    });

    return {
      id: mealPlanId,
      startDate,
      endDate,
      items,
      estimatedBudget: items.reduce((sum, item) => sum + item.estimatedCost, 0),
      allergens,
    };
  }
}
