import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  boolean,
} from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}))

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // Unit 1
  description: text('description').notNull(), // Learn the basics of spanish
  courseId: integer('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: integer('order').notNull(),
})

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  unitId: integer('unit_id').references(() => units.id, {
    onDelete: 'cascade',
  }),
  order: integer('order').notNull(),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}))

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST'])

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengesOptions),
  challengeProgress: many(challengesProgress),
}))

export const challengesOptions = pgTable('challenges_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: text('image_src'),
  audioSrc: text('audio_src'),
})

export const challengesOptionsRelations = relations(
  challengesOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengesOptions.challengeId],
      references: [challenges.id],
    }),
  }),
)

export const challengesProgress = pgTable('challenges_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // TODO: Confirm this does'nt break
  challengeId: integer('challenge_id')
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed').notNull().default(false),
})

export const challengesProgressRelations = relations(
  challengesProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengesProgress.challengeId],
      references: [challenges.id],
    }),
  }),
)

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('user'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0),
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}))