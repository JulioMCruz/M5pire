'use client'

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ItemReturnComponent() {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      title: "Initiate Rental",
      description: "The renter agrees to rent the item.",
      action: "Start",
    },
    {
      title: "Return Inspection",
      description: "User captures an AI-powered AR image to verify the item's condition upon return.",
      action: "Return",
    },
    {
      title: "Rental Validation",
      description: "The image is uploaded to an AI agent, which checks if the item matches its original condition.",
      action: "AI Validation",
    },
    {
      title: "Complete Rental",
      description: "The renter's deposit is released by the AVA protocol.",
      action: "Deposit Release",
    },
    {
        title: "Notifiction",
        description: "The renter's gets a notification that his deposit is returned, through AVA protocol.",
        action: "Deposit Release",
      },
    ];

  const handleStepAction = (stepIndex: number) => {
    console.log(`Action for step ${stepIndex + 1} executed`)
    if (stepIndex + 1 > currentStep) {
      setCurrentStep(stepIndex + 1)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 mt-4 lg:mt-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "bg-green-500 border-green-500"
                  : index === currentStep
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                index + 1
              )}
            </div>
            <h3 className="mt-2 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-gray-500 min-h-14">{step.description}</p>
            <Button 
              className="mt-4"
              onClick={() => handleStepAction(index)}
              disabled={index > currentStep}
            >
              {step.action}
            </Button>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}