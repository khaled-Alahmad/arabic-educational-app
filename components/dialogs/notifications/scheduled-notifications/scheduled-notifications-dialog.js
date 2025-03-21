"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postData } from "@/lib/apiHelper";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusUser } from "@/data/data"
import { Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
export function ScheduledNotificationsDialog({ isOpen, onClose, onSave, initialData }) {
    // Initialize form data state using a similar pattern to the InsulinDosesDialog
    const initialForm = {
        title: initialData?.title || "",
        content: initialData?.content || "",
        image: initialData?.image || "",
        type: initialData?.type || "",
        month: initialData?.month || "",
        week: initialData?.week || "",
        day: initialData?.day || "",


        time: initialData?.time,

        status: initialData?.status || "",
    };
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);

            setFormData({
                title: initialData?.title || "",
                content: initialData?.content || "",
                image: initialData?.image || "",
                type: initialData?.type || "",
                month: initialData?.month || "",
                week: initialData?.week || "",
                day: initialData?.day || "",


                time: initialData?.time || "",

                status: initialData?.status || "",
            });
        } else {
            setFormData(initialForm);
        }
    }, [initialData]);

    const [imagePreview, setImagePreview] = useState(initialData?.image || "");
    const [imageLink, setImageLink] = useState(initialData?.image || "");

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const response = await postData("general/upload-image", { image: file, folder: "games" }, {});
            if (response.success) {
                setImageLink(response.data.image_name);
                setImagePreview(URL.createObjectURL(file));
            } else {
                toast.error("فشل رفع الصورة");
            }
        }
    };

    const handleSubmit = (e) => {
        setIsLoading(true)

        e.preventDefault();

        // Basic validation
        // if (!formData.first_name) return toast.error("الاسم الأول مطلوب");
        // if (!formData.last_name) return toast.error("اسم العائلة مطلوب");
        // if (!formData.email.includes("@")) return toast.error("البريد الإلكتروني غير صالح");
        // if (!formData.phone) return toast.error("رقم الهاتف مطلوب");
        // if (!initialData && formData.password.length < 6) return toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
        // if (formData.password !== formData.password_confirmation) return toast.error("كلمات المرور غير متطابقة");

        // Build payload with keys as user[first_name], etc.
        const payload = {
            title: formData?.title,
            content: formData?.content,
            image: imageLink,
            type: formData?.type,
            month: formData?.month,
            week: formData?.week,
            day: formData?.day,


            time: formData?.time,

            status: formData?.status,


        };

        console.log("Submitting payload:", payload);
        onSave(payload);
        // onClose();
        setIsLoading(false)

    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "تحديث المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "قم بتحديث بيانات المستخدم هنا." : "أدخل بيانات المستخدم الجديد هنا."}
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">عنوان المنبه</Label>
                        <Input id="title"
                            value={formData.title}
                            onChange={(value) => handleChange("title", value.target.value)}
                            placeholder="أدخل عنوان المنبه" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">محتوى المنبه</Label>
                        <Textarea id="content"
                            value={formData.content}
                            onChange={(value) => handleChange("content", value.target.value)}
                            placeholder="أدخل محتوى المنبه" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">نوع التكرار</Label>
                        <Select
                            value={formData.type.toString()}
                            onValueChange={(value) => handleChange("type", value)}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="اختر نوع التكرار" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">يومي</SelectItem>
                                <SelectItem value="weekly">أسبوعي</SelectItem>
                                <SelectItem value="monthly">شهري</SelectItem>
                                <SelectItem value="yearly">سنوي</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="month">الشهر (للتكرار الشهري والسنوي)</Label>
                        <Select
                            value={formData.month.toString()}
                            onValueChange={(value) => handleChange("month", value)}
                        >
                            <SelectTrigger id="month">
                                <SelectValue placeholder="اختر الشهر" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        {new Date(2023, i, 1).toLocaleString('ar-SA', { month: 'long' })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="week">الأسبوع (للتكرار الأسبوعي)</Label>
                        <Select
                            value={formData.week.toString()}
                            onValueChange={(value) => handleChange("week", value)}
                        >
                            <SelectTrigger id="week">
                                <SelectValue placeholder="اختر الأسبوع" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 53 }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        الأسبوع {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="day">اليوم</Label>
                        <Select
                            value={formData.day.toString()}
                            onValueChange={(value) => handleChange("day", value)}
                        >
                            <SelectTrigger id="day">
                                <SelectValue placeholder="اختر اليوم" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time" >الوقت</Label>
                        <Input id="time" type="time" value={formData.time ? new Date(formData.time).toISOString().slice(11, 16) : ""}
                            onChange={(value) => handleChange("time", value.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">الحالة</Label>
                        <Select value={formData.status.toString()} onValueChange={(value) => handleChange("status", value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">نشط</SelectItem>
                                <SelectItem value="inactive">غير نشط</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>الصورة </Label>
                        <Input type="file" onChange={handleImageChange} />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="h-[100px] w-[100px] object-cover rounded border border-gray-300" />
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" style={{ marginInline: "1rem" }} variant="outline" onClick={onClose}>
                            إلغاء
                        </Button>
                        <Button
                            onClick={handleSubmit}

                            disabled={isLoading}

                            className="bg-[#ffac33] hover:bg-[#f59f00]">
                            {initialData ? "تحديث" : "إضافة"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
