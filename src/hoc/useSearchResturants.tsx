import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MealBarProps } from '../components/meal-bar.component';
import { RestaurantCardProps } from '../components/restaurant-card.component';
import { axiosInstance } from '../utils/axiosInstance';

export type RestaurantSearchData = RestaurantCardProps & {
  meals: Array<MealBarProps>;
};

const useSearchRestaurant = () => {
  const state = useSelector((state) => state.authentication);
  const [searchResults, setSearchResults] = useState<Array<RestaurantSearchData>>([]);
  const [loading, setLoading] = useState(false);

  const onSearchResults = async (needle: string, heyStack: Array<RestaurantSearchData>) => {
    if (!needle.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerCaseNeedle = needle.toLowerCase();
    setLoading(true);
    // Fetch restaurant + meal details for ALL in heyStack
    const restaurantDetails = await Promise.all(
      heyStack.map(item => handleFetchRestaurant(item.id))
    );

    const finalResults: RestaurantSearchData[] = restaurantDetails.map((detail, index) => {
      const restaurant = heyStack[index];

      if (!detail) return null;

      const allMeals = detail?.menu?.menuGroups?.flatMap(group => group.meals) || [];
      const matchedMeals = allMeals.filter(meal =>
        meal.label?.toLowerCase().includes(lowerCaseNeedle)
      );
      

      const titleMatches = restaurant.title.toLowerCase().includes(lowerCaseNeedle);
      
      if (titleMatches || matchedMeals.length > 0) {
        return {
          ...restaurant,
          meals: matchedMeals,
        };
      }

      return null;
    }).filter(Boolean) as RestaurantSearchData[];
    setSearchResults(finalResults);
    setLoading(false);
  };

  const handleFetchRestaurant = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/restaurant/${id}/${state?.user_data?.id}`);
      return response?.data?.restaurant || null;
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      return null;
    }
  };

  return {
    searchResults,
    onSearchResults,
    loading
  };
};

export default useSearchRestaurant;
