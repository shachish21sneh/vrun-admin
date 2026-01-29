import React from "react";
import { ContactPerson } from "@/constants/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactPersonCardProps {
  contactPerson: ContactPerson[];
}

const ContactPersonCard: React.FC<ContactPersonCardProps> = ({
  contactPerson,
}) => {
  return (
    <div className="flex flex-wrap">
      {Array.isArray(contactPerson) &&
        contactPerson.map((person: ContactPerson) => (
          <Card key={person?.email} className="max-w-sm m-4">
            <CardHeader>
              <CardTitle>{person?.name}</CardTitle>
              <CardDescription>{person?.position}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-base">Email: {person?.email}</p>
              <p className="text-gray-700 text-base">Phone: {person?.phone}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ContactPersonCard;
