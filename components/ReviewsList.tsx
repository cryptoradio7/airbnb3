'use client';

import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, User } from 'lucide-react';
import StarRating from './StarRating';

interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  hostReply?: string | null;
  createdAt: string | Date;
  user: ReviewUser;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  listingId?: string;
}

const RATINGS = [5, 4, 3, 2, 1];
const PAGE_SIZE = 5;

export default function ReviewsList({
  reviews: initialReviews,
  averageRating,
  totalReviews,
  listingId,
}: ReviewsListProps) {
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [page, setPage] = useState(1);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Client-side filtering & pagination on initial data
  const filtered =
    ratingFilter === 'all'
      ? initialReviews
      : initialReviews.filter((r) => r.rating === ratingFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const ratingCounts = RATINGS.map((r) => ({
    rating: r,
    count: initialReviews.filter((rev) => rev.rating === r).length,
  }));

  const toggleReply = (id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (totalReviews === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p>Aucun avis pour le moment.</p>
        {listingId && (
          <p className="text-sm mt-1">
            Soyez le premier à partager votre expérience !
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center sm:border-r sm:pr-6">
          <div className="text-5xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <StarRating value={Math.round(averageRating)} readOnly size="sm" />
          <p className="text-sm text-gray-500 mt-1">{totalReviews} avis</p>
        </div>
        <div className="flex-1 space-y-1">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right text-gray-600">{rating}</span>
              <StarRating value={rating} readOnly size="sm" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-yellow-400 rounded-full transition-all"
                  style={{
                    width:
                      totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%',
                  }}
                />
              </div>
              <span className="w-6 text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter by rating */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setRatingFilter('all'); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            ratingFilter === 'all'
              ? 'bg-[#FF385C] text-white border-[#FF385C]'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          Tous
        </button>
        {RATINGS.map((r) => (
          <button
            key={r}
            onClick={() => { setRatingFilter(r); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              ratingFilter === r
                ? 'bg-[#FF385C] text-white border-[#FF385C]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {r} ★
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {paginated.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            Aucun avis pour cette note.
          </p>
        ) : (
          paginated.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {review.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.user.image}
                      alt={review.user.name ?? 'Utilisateur'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {review.user.name ?? 'Anonyme'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <StarRating value={review.rating} readOnly size="sm" />
                  {review.comment && (
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Host reply */}
                  {review.hostReply && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleReply(review.id)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                      >
                        {expandedReplies.has(review.id) ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Masquer la réponse de l&apos;hôte
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Réponse de l&apos;hôte
                          </>
                        )}
                      </button>
                      {expandedReplies.has(review.id) && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Réponse de l&apos;hôte
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {review.hostReply}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
