import { Field, Form, Formik, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { type NoteTag } from "../../types/note";

interface CreateNoteFormValues {
  title: string;
  content: string;
  tag: NoteTag | "";
}

interface NoteFormProps {
  onSuccess: () => void;
}

const initialValues: CreateNoteFormValues = {
  title: "",
  content: "",
  tag: "",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  const handleSubmit = (
    values: CreateNoteFormValues,
    actions: FormikHelpers<CreateNoteFormValues>
  ) => {
    createMutation.mutate({
      ...values,
      tag: values.tag as NoteTag,
    });
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field as="textarea" id={`${fieldId}-content`} name="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
            <option value="">Select tag</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onSuccess}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
