
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Info, Target, Users, Award, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Info className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">About FindMyClg</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Empowering students to make informed decisions about their higher education journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl text-card-foreground">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To simplify the college selection process by providing comprehensive, 
                    data-driven insights that help students find the perfect match for their 
                    academic goals and career aspirations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl text-card-foreground">Who We Serve</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Students preparing for engineering entrance exams, parents seeking guidance, 
                    and counselors looking for reliable data to support their recommendations.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  What We Offer
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Comprehensive tools and resources for college selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">College Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Detailed analysis based on ranks, preferences, and categories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">Smart Filtering</h4>
                        <p className="text-sm text-muted-foreground">
                          Advanced filters to narrow down options based on your criteria
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">PDF Export</h4>
                        <p className="text-sm text-muted-foreground">
                          Download and share your college analysis results
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-card-foreground">Data-Driven Insights</h4>
                        <p className="text-sm text-muted-foreground">
                          Reliable information to support your decision-making
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  About the Developer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  FindMyClg is developed by <span className="font-semibold text-primary">Awej Pathan</span>, 
                  a passionate developer dedicated to creating tools that make a positive impact on students' lives.
                </p>
                <p className="text-muted-foreground">
                  Connect with Awej on social media to stay updated with the latest features and improvements 
                  to the platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
