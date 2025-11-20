import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, Mail } from "lucide-react"

const contact = {
  name: "Antonia Widmann",
  role: "Human Resources Officer",
  phone: "089 4168 219",
  email: "jobs@gut-kaltenbrunn.de",
  initials: "AW",
}

export function EmployerContactCard() {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 bg-slate-700 text-white">
            <AvatarFallback className="bg-slate-700 text-white font-semibold">{contact.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{contact.name}</p>
            <p className="text-sm text-muted-foreground">{contact.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-muted text-[#FDB714] hover:text-[#FDB714]/80"
            asChild
          >
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4" />
              <span className="text-sm">{contact.phone}</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-muted text-[#FDB714] hover:text-[#FDB714]/80"
            asChild
          >
            <a href={`mailto:${contact.email}`}>
              <Mail className="h-4 w-4" />
              <span className="text-sm">{contact.email}</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
