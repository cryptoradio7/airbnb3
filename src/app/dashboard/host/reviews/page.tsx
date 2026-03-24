'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare, Send, ChevronDown, ChevronUp, User } from 'lucide-react';
import StarRating from '@/components/StarRating';

interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  hostReply: string | null;
  createdAt: string;
  user: ReviewUser;
  listing: {
    id: string;
    title: string;
  };
}

export default function HostReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [replyError, setReplyError] = useState<Record<string, string>>({});
  const [expandedReply, setExpandedReply] = useState<Set<string>>(new Set());
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReviews();
    }
  }, [session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews/host');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (reviewId: string) => {
    const reply = replyText[reviewId]?.trim();
    if (!reply) return;

    setReplyLoading((prev) => ({ ...prev, [reviewId]: true }));
    setReplyError((prev) => ({ ...prev, [reviewId]: '' }));

    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReplyError((prev) => ({
          ...prev,
          [reviewId]: data.error ?? 'Erreur lors de la réponse',
        }));
      } else {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, hostReply: reply } : r
          )
        );
        setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
        setExpandedReply((prev) => {
          const next = new Set(prev);
          next.delete(reviewId);
          return next;
        });
      }
    } catch {
      setReplyError((prev) => ({ ...prev, [reviewId]: 'Erreur réseau' }));
    } finally {
      setReplyLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const toggleReplyForm = (reviewId: string) => {
    setExpandedReply((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const filtered =
    ratingFilter === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(ratingFilter, 10));

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Avis reçus</h1>
          <p className="text-gray-600 mt-1">
            Gérez et répondez aux avis de vos voyageurs
          </p>
        </div>

        {/* Stats */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">Note moyenne</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-500">Avis totaux</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.filter((r) => r.hostReply).length}
                </div>
                <div className="text-sm text-gray-500">Réponses envoyées</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        {reviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', '5', '4', '3', '2', '1'].map((val) => (
              <button
                key={val}
                onClick={() => setRatingFilter(val)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  ratingFilter === val
                    ? 'bg-[#FF385C] text-white border-[#FF385C]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {val === 'all' ? 'Tous' : `${val} ★`}
              </button>
            ))}
          </div>
        )}

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {reviews.length === 0 ? 'Aucun avis pour le moment' : 'Aucun avis pour ce filtre'}
            </h3>
            <p className="text-gray-500 text-sm">
              Les avis apparaissent ici lorsque vos voyageurs notent leurs séjours.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {review.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.user.image}
                        alt={review.user.name ?? ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={review.rating} readOnly size="sm" />
                      <span className="text-xs text-gray-500">
                        · {review.listing.title}
                      </span>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 pl-13">
                    {review.comment}
                  </p>
                )}

                {/* Existing host reply */}
                {review.hostReply && (
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm mb-3">
                    <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Votre réponse
                    </p>
                    <p className="text-gray-600">{review.hostReply}</p>
                  </div>
                )}

                {/* Reply form toggle */}
                <div>
                  <button
                    onClick={() => toggleReplyForm(review.id)}
                    className="flex items-center gap-1 text-sm font-medium text-[#FF385C] hover:underline"
                  >
                    {expandedReply.has(review.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        {review.hostReply ? 'Modifier la réponse' : 'Répondre'}
                      </>
                    )}
                  </button>

                  {expandedReply.has(review.id) && (
                    <div className="mt-3">
                      <textarea
                        rows={3}
                        value={replyText[review.id] ?? review.hostReply ?? ''}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                        placeholder="Répondez publiquement à cet avis…"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent resize-none"
                      />
                      {replyError[review.id] && (
                        <p className="text-red-600 text-xs mt-1">
                          {replyError[review.id]}
                        </p>
                      )}
                      <button
                        onClick={() => submitReply(review.id)}
                        disabled={
                          replyLoading[review.id] ||
                          !replyText[review.id]?.trim()
                        }
                        className="mt-2 px-4 py-2 bg-[#FF385C] text-white text-sm font-medium rounded-lg hover:bg-[#E31C5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {replyLoading[review.id]
                          ? 'Envoi…'
                          : 'Envoyer la réponse'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
