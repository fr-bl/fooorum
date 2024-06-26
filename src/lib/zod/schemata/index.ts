import { z } from "zod";
export const emptyString = z.literal("").transform(() => null);
export const requiredString = z.string().min(1);
export const requiredNumberCoercable = z
  .number()
  .or(requiredString)
  .pipe(z.coerce.number());
export const slug = z
  .string()
  .min(3)
  .refine((arg) => /^[a-z0-9\-]+$/.test(arg), {
    params: { i18n: { key: "invalid_slug" } },
  });

export const password = z.string().max(255);

export const voteScore = z.coerce.number().int().min(-1).max(1);

export const loginForm = z.object({
  username: slug,
  password: password,
});

export const userEditForm = z.object({
  name: slug,
  description: emptyString.nullable().or(z.string()),
});

export const forumCreationForm = z.object({
  name: slug,
  description: emptyString.nullable().or(z.string()),
});

export const forumEditForm = forumCreationForm.merge(
  z.object({
    id: requiredNumberCoercable,
  }),
);

export const postCreationForm = z.object({
  forumId: requiredNumberCoercable,
  title: z.string(),
  description: z.string(),
  embedUrl: emptyString.nullable().or(z.string().url()),
});

export const postEditForm = postCreationForm.omit({ forumId: true }).merge(
  z.object({
    id: requiredNumberCoercable,
  }),
);

export const postDeletionForm = z.object({
  id: z.coerce.number(),
});

export const commentCreationForm = z.object({
  postId: requiredNumberCoercable,
  parentId: emptyString.nullable().or(z.coerce.number()),
  description: z.string(),
});

export const commentEditForm = commentCreationForm
  .omit({ postId: true, parentId: true })
  .merge(
    z.object({
      id: requiredNumberCoercable,
    }),
  );

export const commentDeletionForm = z.object({
  id: z.coerce.number(),
});

export const postVoteEditForm = z.object({
  postId: requiredNumberCoercable,
  commentId: emptyString.nullable(),
  score: voteScore,
});

export const commentVoteEditForm = z.object({
  postId: emptyString.nullable(),
  commentId: requiredNumberCoercable,
  score: voteScore,
});

export const voteEditForm = z.union([postVoteEditForm, commentVoteEditForm]);

export const postReplyParams = z.object({
  postId: requiredNumberCoercable,
});
export const commentReplyParams = z.object({
  postId: requiredNumberCoercable,
  parentId: requiredNumberCoercable,
});
