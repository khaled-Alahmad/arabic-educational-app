"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"
import { postData } from "@/lib/apiHelper"

export function ToTasksEditDialog({ game, open, onOpenChange, onSave, handleAddEntity }) {
  // If editing an existing game, load its data; otherwise, use default values.
  const initialForm = {
    title: game?.title || "",
    // points: game?.points || "",
    // color: game?.color || "#000000",
    // image: null,
  }
  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLink, setImageLink] = useState("");

  // Update form state if the passed game changes (for edit mode)
  useEffect(() => {
    if (game) {
      setForm({
        title: game?.title || "",
        // points: game?.points || "",
        // color: game?.color || "#000000",
        // image: null,
      })
      setImagePreview(game.image || null)
    } else {
      setForm(initialForm)
      setImagePreview(null)
    }
  }, [game])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     const response = await postData("general/upload-image", { image: file, folder: `games` }, {});
  //     console.log("Upload response:", response);

  //     if (response.success) {
  //       // imageLink = response.data.image_name;
  //       setImageLink(response.data.image_name); // إضافة رابط الصورة إلى البيانات
  //       console.log(response.data.image_name);

  //       handleChange("image", response.data.image_name)

  //     } else {
  //       toast.error("فشل رفع الصورة");
  //       return;
  //     }
  //     setImagePreview(URL.createObjectURL(file)); // Generate preview URL
  //   } else {
  //     setImagePreview(null)
  //   }
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true)
    // Construct newGame object from form state.
    const newGame = {
      title: form?.title || "",
      // points: form?.points || "",
      // color: form?.color || "#000000",
      // image: null,
      // image: form.image
    }
    // if (form.image) {
    //   newGame.image = form.image
    // }
    // Pass the form data along with the image file (if any)
    onSave(newGame)
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {game ? "تعديل مهمة الطفل" : "إضافة لعبة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {game
              ? "قم بتعديل بيانات مهمة الطفل هنا."
              : "أدخل بيانات اللعبة الجديدة هنا. اضغط على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان مهمة الطفل</Label>
            <Input
              id="title"
              required
              placeholder="أدخل عنوان مهمة الطفل"

              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {/* Description */}
          {/* <div className="space-y-2">
            <Label htmlFor="description">وصف اللعبة</Label>
            <Textarea
              id="description"
              placeholder="أدخل وصف اللعبة"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div> */}
          {/* Switch for is_enable */}
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="is_enable">تفعيل اللعبة</Label>
            <Switch
              id="is_enable"
              color="primary"
              checked={form.is_enable}
              onCheckedChange={(checked) => handleChange("is_enable", checked)}
            />
          </div> */}
          {/* Color Picker */}

          <DialogFooter>
            <Button
              style={{ marginInline: "1rem" }}
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-[#ffac33] mx-4 hover:bg-[#f59f00]"
              disabled={isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
