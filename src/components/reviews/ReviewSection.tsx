'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Star, ThumbsUp, Flag, MessageSquare, ChevronDown } from 'lucide-react';
import { StarRating, Button, Textarea, Divider, EmptyState, Badge } from '@/components/ui';
import { createReview, markReviewHelpful } from '@/services/reviews';
import { useAuth } from '@/hooks/useAuth';
import type { Review, ReviewFormData } from '@/types';
import { timeAgo, cn } from '@/utils';
import toast from 'react-hot-toast';

// ─── Claim Banner ─────────────────────────────────────────────────────────────

export function ClaimBanner({ listingId, listingName }: { listingId: string; listingName: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
      <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Is this your business?</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
          Claim this listing to manage your profile, respond to reviews, and add photos.
        </p>
        <Link
          href={`/claim/${listingId}`}
          className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Claim {listingName} →
        </Link>
      </div>
    </div>
  );
}

// ─── Review Section ───────────────────────────────────────────────────────────

interface ReviewSectionProps {
  listingId:      string;
  initialReviews: Review[];
  listingName:    string;
}

export function ReviewSection({ listingId, initialReviews, listingName }: ReviewSectionProps) {
  const [reviews,     setReviews]     = useState<Review[]>(initialReviews);
  const [showForm,    setShowForm]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [rating,      setRating]      = useState(0);
  const [body,        setBody]        = useState('');
  const [showAll,     setShowAll]     = useState(false);

  const { user, isLoggedIn } = useAuth();

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) { toast.error('Sign in to leave a review'); return; }
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (body.trim().length < 10) { toast.error('Review must be at least 10 characters'); return; }

    setSubmitting(true);
    try {
      const id = await createReview(listingId, user.uid, { rating, body } as ReviewFormData);
      const newReview: Review = {
        id,
        listingId,
        authorId:    user.uid,
        authorName:  'Anonymous Visitor',
        rating,
        body,
        helpful:     0,
        reported:    false,
        reportCount: 0,
        status:      'active',
        createdAt:   { toDate: () => new Date() } as Review['createdAt'],
        updatedAt:   { toDate: () => new Date() } as Review['updatedAt'],
      };
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setRating(0);
      setBody('');
      toast.success('Review posted!');
    } catch {
      toast.error('Failed to post review. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    await markReviewHelpful(reviewId).catch(() => {});
    setReviews(reviews.map((r) => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Reviews
          {reviews.length > 0 && (
            <span className="text-sm font-normal text-surface-400">({reviews.length})</span>
          )}
        </h2>
        {isLoggedIn ? (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Write Review'}
          </Button>
        ) : (
          <Link href="/auth">
            <Button size="sm" variant="secondary">Sign in to review</Button>
          </Link>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-surface-50 dark:bg-dark-card2 rounded-2xl space-y-4">
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Your rating</p>
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          <Textarea
            label="Your review"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder={`Share your experience at ${listingName}...`}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" loading={submitting} disabled={!rating || body.length < 10}>
              Post Review
            </Button>
            <p className="text-xs text-surface-400">Posted as "Anonymous Visitor"</p>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No reviews yet"
          message={`Be the first to share your experience at ${listingName}`}
          action={isLoggedIn ? (
            <Button onClick={() => setShowForm(true)}>Write a Review</Button>
          ) : (
            <Link href="/auth"><Button>Sign In to Review</Button></Link>
          )}
        />
      ) : (
        <div className="space-y-5">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
          ))}

          {reviews.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm text-brand-500 font-semibold flex items-center justify-center gap-1 hover:text-brand-600 transition-colors"
            >
              Show {reviews.length - 5} more reviews <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, onHelpful }: { review: Review; onHelpful: (id: string) => void }) {
  return (
    <div className="border border-surface-100 dark:border-dark-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-surface-900 dark:text-white">{review.authorName}</span>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <span className="text-xs text-surface-400">{timeAgo(review.createdAt)}</span>
        </div>
        <Badge variant={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'danger'} size="sm">
          {review.rating}/5
        </Badge>
      </div>

      {review.title && (
        <p className="font-semibold text-sm text-surface-800 dark:text-white mb-1">{review.title}</p>
      )}
      <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{review.body}</p>

      {/* Owner reply */}
      {review.ownerReply && (
        <div className="mt-3 pl-3 border-l-2 border-brand-500">
          <p className="text-xs font-bold text-brand-500 mb-1">Owner Reply</p>
          <p className="text-xs text-surface-600 dark:text-surface-300">{review.ownerReply.body}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-100 dark:border-dark-border">
        <button
          onClick={() => onHelpful(review.id)}
          className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-brand-500 transition-colors"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful {review.helpful > 0 && `(${review.helpful})`}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-red-500 transition-colors">
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>
    </div>
  );
}
