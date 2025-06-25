"use client";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CourseService from "@/lib/services/course.service";
import { Course } from "@/lib/types/course";
import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function AdminCourse() {
  const courseService = new CourseService();
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  
  /* ──────────────── i18n / locale ────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Courses");
  const tCommon = useTranslations("Common");
  
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const breadcrumbs = useMemo(() => [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: t("breadcrumbs.courses") },
  ], [locale, t]);

  const fields = useMemo(() => [
    { key: "name", label: t("fields.name") },
    { key: "description", label: t("fields.description") },
    { key: "scope", label: t("fields.scope") },
    { key: "created_at", label: t("fields.createdDate"), type: "date" },
  ], [t]);

  const modalFields = useMemo(() => [
    { 
      key: "name", 
      label: t("modal.nameLabel"), 
      type: "text",
      required: true,
      placeholder: t("modal.namePlaceholder")
    },
    { 
      key: "description", 
      label: t("modal.descriptionLabel"), 
      type: "textarea",
      placeholder: t("modal.descriptionPlaceholder")
    },
    { 
      key: "scope", 
      label: t("modal.scopeLabel"), 
      type: "textarea",
      placeholder: t("modal.scopePlaceholder")
    },
  ], [t]);

  const handleAdd = async (data: Course) => {
    const result = await courseService.create(data);
    if (result.success) {
      console.log(t("messages.addSuccess"));
      return result;
    } else {
      console.error(t("messages.error"));
      throw new Error(result.error);
    }
  };

  const handleUpdate = async (id: string | number, data: Course) => {
    const result = await courseService.update(id, data);
    if (result.success) {
      console.log(t("messages.updateSuccess"));
      return result;
    } else {
      console.error(t("messages.error"));
      throw new Error(result.error);
    }
  };

  const handleEdit = (item: Course) => {
    setIsEditing(true);
    setModalTitle(t("modal.editTitle"));
    // Return item data so AdvancedDataTable can use it for formData
    return item;
  };

  const handleCreate = () => {
    setIsEditing(false);
    setModalTitle(t("modal.addTitle"));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>
      
      <AdvancedDataTable
        fields={fields}
        page={page}
        service={courseService}
        onPageChange={onPageChange}
        linkBase={`/${locale}/admin/courses`}
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
        modalTitle={modalTitle || t("modal.addTitle")}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
    </div>
  );
}
