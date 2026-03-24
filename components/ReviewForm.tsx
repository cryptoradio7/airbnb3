'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';

interface ReviewFormProps {
  listingId: string;
  bookingId: string;
  listingTitle?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  listingId,
  bookingId,
  listingTitle,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const ratingLabels: Record<number, string> = {
    1: 'Très décevant',
    2: 'Décevant',
    3: 'Correct',
    4: 'Bien',
    5: 'Excellent !',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Veuillez sélectionner une note.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, bookingId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        return;
      }

      setSuccess(true);
      onSuccess?.();

      // Redirect after short delay
      setTimeout(() => {
        router.push(`/listings/${listingId}`);
        router.refresh();
      }, 1500);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Avis publié !</h3>
        <p className="text-gray-600">Merci pour votre retour. Redirection en cours…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {listingTitle && (
        <p className="text-gray-600 text-sm">
          Logement : <span className="font-medium text-gray-900">{listingTitle}</span>
        </p>
      )}

      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre note <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-sm font-medium text-[#FF385C]">
              {ratingLabels[rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Votre commentaire <span className="text-gray-400">(facultatif)</span>
        </label>
        <textarea
          id="review-comment"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Décrivez votre expérience : l'accueil, la propreté, la localisation…"
          maxLength={1000}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {comment.length}/1000
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full py-3 px-6 bg-[#FF385C] text-white font-semibold rounded-xl hover:bg-[#E31C5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Publication…' : 'Publier mon avis'}
      </button>
    </form>
  );
}
