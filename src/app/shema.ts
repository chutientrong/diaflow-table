import { z } from "zod";

// Schema for Microsoft Edge demo data structure
export const dataSchema = z.object({
  name: z.string(),
  language: z.string(),
  id: z.string(),
  bio: z.string(),
  version: z.number(),
});

export type DataSchema = z.infer<typeof dataSchema>;

// Extended schema with additional fields for table functionality
export const extendedDataSchema = dataSchema.extend({
  primary: z.boolean().optional(),
  state: z.string().optional(),
  createdDate: z.date().optional(),
});

export type ExtendedDataSchema = z.infer<typeof extendedDataSchema>;

// Filter schema for demo data
export const filterSchema = z.object({
  name: z.string().optional(),
  language: z.string().optional(),
  version: z
    .string()
    .transform((val) => val.split(","))
    .pipe(z.coerce.number().array())
    .optional(),
  state: z.string().optional(),
  createdDate: z
    .string()
    .transform((val) => val.split("|"))
    .pipe(z.coerce.date().array())
    .optional(),
});

export type FilterSchema = z.infer<typeof filterSchema>;

// Form schema for editable row
export const editableRowSchema = z.object({
  id: z.string().min(1, "ID is required"),
  bio: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  version: z.number().min(1, "Version is required"),
  createdDate: z.string().min(1, "Created Date is required"),
});

export type EditableRowSchema = z.infer<typeof editableRowSchema>;
