"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Handshake, Users, Globe, Mail } from "lucide-react"

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Handshake className="w-12 h-12 text-teal-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Partnerships</h1>
              <p className="text-xl text-gray-600">Building the future of blockchain education together</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 mb-2">Content Integration</CardTitle>
              <p className="text-sm text-gray-600">
                Partner with us to integrate your educational content and reach our growing community.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 mb-2">Community Building</CardTitle>
              <p className="text-sm text-gray-600">
                Collaborate on community events, workshops, and educational initiatives.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 mb-2">Contact Us</CardTitle>
              <p className="text-sm text-gray-600">
                Ready to partner? Get in touch with our team to discuss opportunities.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Our partnership program is currently under development. We're building a comprehensive platform 
              for content creators, educators, and blockchain projects to collaborate and grow together.
            </p>
            <div className="bg-white rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Coming:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Partnership application form for content integration</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Revenue sharing opportunities for educational content</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Co-marketing and community building initiatives</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Exclusive access to Plasma network features and tools</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Menu
                </Button>
              </Link>
              <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                <Mail className="mr-2 w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
