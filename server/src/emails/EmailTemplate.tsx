import React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = () => (
  <div>
    <h1>
      Please activate your account by clicking link :
      http:localhost:3000/activate/token
    </h1>
  </div>
);
