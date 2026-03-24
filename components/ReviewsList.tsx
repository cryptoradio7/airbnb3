import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsList({ reviews, averageRating, totalReviews }: ReviewsListProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">Aucun avis pour le moment</div>
        <div className="text-sm text-gray-400">
          Soyez le premier à laisser un avis !
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Rating summary */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            {renderStars(Math.round(averageRating))}
            <div className="text-gray-600 mt-1">
              {totalReviews} avis{totalReviews > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        {/* Rating breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => Math.round(r.rating) === stars).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-2">
                <div className="w-8 text-sm text-gray-600">{stars} étoiles</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-8 text-sm text-gray-600 text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name || 'Utilisateur'}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {review.user.name || 'Utilisateur anonyme'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMMM yyyy', { locale: fr })}
                  </div>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            
            {review.comment && (
              <p className="text-gray-700 whitespace-pre-line">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}