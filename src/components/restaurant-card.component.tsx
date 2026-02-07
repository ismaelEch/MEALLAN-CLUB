import React, { PropsWithChildren, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { CDNURL } from '../config/Url';
import { axiosInstance } from '../utils/axiosInstance';
import { XColors } from '../config/constants';
import { useTranslation } from 'react-i18next';

export type RestaurantCardProps = PropsWithChildren<{
  onClick?: CallableFunction;
  title: string;
  cover: ImageSourcePropType;
  picture?: string;
  distance: number;
  rating?: number;
  reviewsCount: number;
  width?: number | string;
  heartIcon: string;
  points?: number;
  latitude?: number;
  longitude?: number;
  id: number;
}>;

export const RestaurantCard = (props: RestaurantCardProps) => {
  const { t } = useTranslation();
  const state: any = useSelector((st: any) => st.authentication);
  const [favorite, setFavorite] = useState<any>({});
  const dispatch = useDispatch();
  const [favoriteDto, setFavoriteDto] = useState<any>({
    isFavorite: false,
    favId: null,
  });

  function convertDistance(distanceInKM: number) {
    const distanceInMeters = distanceInKM * 1000;

    if (distanceInMeters < 100) {
      return `${distanceInMeters.toFixed(2)} ${t('m')}`;
    }

    return `${Number(distanceInKM || 0).toFixed(2)} ${t('km')}`;
  }

  const allFavorites = useSelector(
  (state: any) => state.addFavoritesReducer.allFavorites
);

  const isFavorite = allFavorites?.some(
  fav => fav?.restaurant?.id === props.id
);


  const handleAddFavoriteRestaurant = async () => {
  if (isFavorite) {
    await axiosInstance.delete(`/favorites/${props.id}`);
    dispatch({ type: 'REMOVE_FAVORITE', payload: props.id });
  } else {
    const res = await axiosInstance.post('/favorites/add', {
      userId: state.user_data.id,
      restaurantId: props.id,
    });
    dispatch({ type: 'ADD_FAVORITE', payload: res.data });
  }
};


  return (
    <View>
      {state.login_user && (
        <TouchableOpacity
          onPress={handleAddFavoriteRestaurant}
          style={styles.favoriteButton}>
          <AntDesign
            name={isFavorite ? 'heart' : 'hearto'}
            size={16}
            color="tomato"
          />
        </TouchableOpacity>
      )}
      <TouchableNativeFeedback onPress={props.onClick}>
        <View style={[styles.card, { width: props.width }]}>
          <View style={styles.imageContainer}>
            <View style={StyleSheet.absoluteFill}>
              <View style={styles.imagePlaceholder}>
                <Image
                  style={styles.image}

                  source={{
                    uri: CDNURL + 'no-image.jpg',
                  }}
                />
              </View>
              <Image
                style={styles.image}

                source={{
                  uri: CDNURL + props?.picture
                }}
              />
            </View>
            {!isNaN(parseInt(props.points)) && (
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{props.points || 0}</Text>
                <Text style={styles.pointsLabel}>{t('Points')}</Text>
              </View>
            )}
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                {convertDistance(props?.distance)}
              </Text>
              <Text style={styles.distanceLabel}>{t('Distance')}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.ratingContainer}>
              {props.rating && (
                <>
                  <AntDesign name="star" size={14} style={styles.starIcon} />
                  <Text style={styles.ratingText}>
                    {props.rating} {t('Rating')} ({props.reviewsCount}+)
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    opacity: 0.8,
    alignSelf: 'flex-end',
    top: 10,
    right: 10,
    position: 'absolute',
    zIndex: 1,
  },
  card: {
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 5,
  },
  imageContainer: {
    position: 'relative',
    display: 'flex',
    height: 180,
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pointsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    margin: 5,
    elevation: 5,
  },
  pointsText: {
    color: XColors.dark,
  },
  pointsLabel: {
    fontSize: 12,
    marginTop: -5,
    color: XColors.dark,
  },
  distanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'flex-end',
    marginRight: 20,
    position: 'absolute',
    top: 150,
    right: -10,
    elevation: 5,
  },
  distanceText: {
    color: XColors.dark,
  },
  distanceLabel: {
    fontSize: 12,
    marginTop: -5,
    color: XColors.dark,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: XColors.dark,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: XColors.dark,
  },
  ratingText: {
    color: XColors.dark,
  },
});
