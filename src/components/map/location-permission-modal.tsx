"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Shield, Zap } from "lucide-react";

interface LocationPermissionModalProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionModal({
  onAllow,
  onDeny,
}: LocationPermissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-mana-black border border-mana-gray-light/20 rounded-3xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-mana-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-mana-mint" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-mana-text mb-4">
          Enable Location Access
        </h2>

        {/* Description */}
        <p className="text-mana-text-secondary mb-6 leading-relaxed">
          To find the best 3D print manufacturers near you, Mana needs access to
          your location. This helps us show accurate distances and delivery
          times.
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-mana-text-secondary">
              Find manufacturers within minutes of you
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-mana-text-secondary">
              Get accurate delivery estimates
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-mana-text-secondary">
              Your location is never shared with manufacturers
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onAllow}
            className="w-full bg-mana-mint text-mana-black hover:bg-mana-mint/90 h-12"
          >
            Allow Location Access
          </Button>
          <Button
            onClick={onDeny}
            variant="outline"
            className="w-full border-mana-gray-light/30"
          >
            Browse Without Location
          </Button>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-mana-text-secondary mt-4 opacity-70">
          We respect your privacy. Location data is only used to improve your
          experience and is never stored or shared.
        </p>
      </div>
    </div>
  );
}
