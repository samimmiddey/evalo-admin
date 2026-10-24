import z from "zod";

const emailRegex = /^(?!.*\.\.)([A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*)@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,64}$/;

export const authSchema = z.object({
   email: z
      .email({ message: 'Email is required' })
      .regex(emailRegex, { message: 'Please enter a valid email address' }),
   password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters long' })
      .regex(passwordRegex, { message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character' })
});

export const otpSchema = z.object({
   code: z
      .string()
      .length(6, { message: 'Code must be 6 digits long' })
      .regex(/^[0-9]{6}$/, { message: 'Code must contain only numbers' })
});

export const forgotPasswordEmailSchema = z.object({
   email: z
      .email({ message: 'Email is required' })
      .regex(emailRegex, { message: 'Please enter a valid email address' }),
   code: z.string()
      .length(6, { message: 'Code must be 6 digits long' })
      .regex(/^[0-9]{6}$/, { message: 'Code must contain only numbers' }),
   password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters long' })
      .regex(passwordRegex, { message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character' })
});

export type AuthSchemaTypes = z.infer<typeof authSchema>;
export type OtpSchemaTypes = z.infer<typeof otpSchema>;
export type ForgotPasswordSchemaEmailTypes = z.infer<typeof forgotPasswordEmailSchema>;