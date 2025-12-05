"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"

export type ApplicationProcessData = {
  emails: string[]
  questions: {
    text: string
    mandatory: boolean
  }[]
}

type ApplicationProcessCardProps = {
  value?: ApplicationProcessData
  onChange: (value: ApplicationProcessData) => void
}

export function ApplicationProcessCard({ value, onChange }: ApplicationProcessCardProps) {
  // ------------------------------  
  // EMAILS STATE  
  // ------------------------------
  const [emails, setEmails] = useState<string[]>(value?.emails ?? [""])

  function handleEmailChange(index: number, val: string) {
    const updated = [...emails]
    updated[index] = val
    setEmails(updated)
  }

  function handleAddEmail() {
    setEmails((prev) => [...prev, ""])
  }

  function handleRemoveEmail(index: number) {
    setEmails((prev) => prev.filter((_, i) => i !== index))
  }

  // ------------------------------  
  // QUALIFICATION QUESTIONS STATE  
  // ------------------------------
  const [questions, setQuestions] = useState<ApplicationProcessData["questions"]>(
    value?.questions ?? [{ text: "", mandatory: false }],
  )

  function handleAddQuestion() {
    setQuestions((prev) => [...prev, { text: "", mandatory: false }])
  }

  function handleQuestionChange(index: number, val: string) {
    const updated = [...questions]
    updated[index].text = val
    setQuestions(updated)
  }

  function handleMandatoryChange(index: number, checked: boolean) {
    const updated = [...questions]
    updated[index].mandatory = checked
    setQuestions(updated)
  }

  function handleRemoveQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  // ------------------------------  
  // SYNC TO PARENT  
  // ------------------------------
  useEffect(() => {
    onChange({ emails, questions })
  }, [emails, questions, onChange])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* LEFT COLUMN */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              BEWERBUNGSPROZESS
            </h3>
            <p className="text-sm text-muted-foreground">
              Geben Sie an, wie sich Bewerbende für diese Stelle bewerben können.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-2 space-y-10">
            {/* EMAILS */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                E-Mail für Bewerbungen <span className="text-destructive">*</span>
              </Label>

              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2 mb-2 relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Bewerbungs-E-Mail eingeben"
                    className="text-base"
                    required
                  />

                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveEmail(index)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Entfernen
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[#FDB913] hover:text-[#FDB913] hover:bg-[#FDB913]/10"
                onClick={handleAddEmail}
              >
                <Plus className="h-4 w-4 mr-1" />
                E-Mail hinzufügen
              </Button>

              <p className="text-sm text-muted-foreground">
                Geben Sie eine oder mehrere E-Mail-Adressen ein, an die Bewerbungen gesendet werden sollen.
              </p>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Qualifikationsfragen
              </Label>

              {questions.map((q, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md bg-muted/30 space-y-3 relative"
                >
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="absolute top-3 right-3 text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <Input
                    placeholder="Qualifikationsfrage eingeben"
                    className="text-base"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`mandatory-${index}`}
                      checked={q.mandatory}
                      onCheckedChange={(val) =>
                        handleMandatoryChange(index, val === true)
                      }
                      className="border-[#FDB913] data-[state=checked]:bg-[#FDB913] data-[state=checked]:border-[#FDB913]"
                    />
                    <Label
                      htmlFor={`mandatory-${index}`}
                      className="font-normal cursor-pointer"
                    >
                      Pflichtfrage
                    </Label>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={handleAddQuestion}
                className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Eine Frage hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
