import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1A202C] mb-2">
          Create Account
        </h2>
        <p className="text-[#718096]">
          Start your learning journey today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[#1A202C] font-medium">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-11 h-12 bg-white border-[#E6F0FF] focus:border-[#0056D1] focus:ring-[#0056D1] rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[#1A202C] font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className="h-12 bg-white border-[#E6F0FF] focus:border-[#0056D1] focus:ring-[#0056D1] rounded-xl"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1A202C] font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-11 h-12 bg-white border-[#E6F0FF] focus:border-[#0056D1] focus:ring-[#0056D1] rounded-xl"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#1A202C] font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="pl-11 pr-11 h-12 bg-white border-[#E6F0FF] focus:border-[#0056D1] focus:ring-[#0056D1] rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#1A202C] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#1A202C] font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-11 pr-11 h-12 bg-white border-[#E6F0FF] focus:border-[#0056D1] focus:ring-[#0056D1] rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#1A202C] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-[#1A202C] font-medium">
            I want to
          </Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'student' | 'teacher' }))}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="student"
                id="student"
                className="peer sr-only"
              />
              <Label
                htmlFor="student"
                className="flex flex-col items-center justify-center p-4 border-2 border-[#E6F0FF] rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-[#0056D1] peer-data-[state=checked]:bg-[#E6F0FF] hover:border-[#0056D1]/50"
              >
                <GraduationCap className="w-8 h-8 mb-2 text-[#0056D1]" />
                <span className="font-medium text-sm">Learn</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="teacher"
                id="teacher"
                className="peer sr-only"
              />
              <Label
                htmlFor="teacher"
                className="flex flex-col items-center justify-center p-4 border-2 border-[#E6F0FF] rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-[#0056D1] peer-data-[state=checked]:bg-[#E6F0FF] hover:border-[#0056D1]/50"
              >
                <Users className="w-8 h-8 mb-2 text-[#0056D1]" />
                <span className="font-medium text-sm">Teach</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Terms */}
        <p className="text-xs text-[#718096] text-center">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-[#0056D1] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-[#0056D1] hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#0056D1] to-[#002A6C] hover:from-[#002A6C] hover:to-[#0056D1] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#0056D1]/25 hover:shadow-xl hover:shadow-[#0056D1]/30"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center mt-6 text-[#718096]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#0056D1] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
