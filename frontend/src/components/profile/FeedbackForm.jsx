import { useState } from 'react';
import { Star } from 'lucide-react';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const FeedbackForm = ({ submitFeedbackFn, submitting }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [experience, setExperience] = useState('Excellent');
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      toast.error('Please add a comment');
      return;
    }
    try {
      await submitFeedbackFn({
        rating,
        experience,
        comment: feedbackComment,
      });
      toast.success('Feedback submitted successfully!');
      setFeedbackComment('');
      setRating(5);
      setExperience('Excellent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Share Your Experience</h2>
      
      {/* Star Rating */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">How would you rate us?</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 hover:scale-110 transition cursor-pointer"
            >
              <Star
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
          <span className="text-sm font-medium text-gray-600 ml-2">
            {rating === 5 ? 'Loved it!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Bad'}
          </span>
        </div>
      </div>

      {/* Experience Chips */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Overall Satisfaction</label>
        <div className="flex flex-wrap gap-2">
          {['Excellent', 'Good', 'Average', 'Poor'].map((exp) => (
            <button
              type="button"
              key={exp}
              onClick={() => setExperience(exp)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
                experience === exp
                  ? 'bg-[#FFF1E6] border-[#ff6900] text-[#ff6900]'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Tell us more</label>
        <textarea
          value={feedbackComment}
          onChange={(e) => setFeedbackComment(e.target.value)}
          placeholder="Write your feedback details here..."
          rows={4}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none resize-none text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
      >
        {submitting ? <Spinner /> : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
