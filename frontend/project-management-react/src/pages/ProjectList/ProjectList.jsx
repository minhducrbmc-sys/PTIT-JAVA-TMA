import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import ProjectCard from './ProjectCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProject } from '@/Redux/Project/Action'

export const tags = [
  'All',
  'React',
  'Next.js',
  'Spring Boot',
  'MySQL',
  'MongoDB',
  'Angular',
  'Python',
  'Flask',
  'Django',
  'Simple Java',
]

const ProjectList = () => {
  const dispatch = useDispatch()
  const { projects } = useSelector((store) => store.project)
  const [searchParams] = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('All')

  // Always fetch full project list on mount
  useEffect(() => {
    dispatch(fetchProject({}))
  }, [dispatch])

  const searchQuery = searchParams.get('search')?.toLowerCase().trim() || ''

  // Single unified filter: handles search, category, and tags together
  const filteredProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return []

    return projects.filter((item) => {
      // 1. Search Query Filter (Title or Description)
      const matchesSearch =
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery) ||
        item.description?.toLowerCase().includes(searchQuery)

      // 2. Category Filter
      const matchesCategory =
        selectedCategory.toLowerCase() === 'all' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase()

      // 3. Tag Filter
      const matchesTag =
        selectedTag.toLowerCase() === 'all' ||
        item.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [projects, searchQuery, selectedCategory, selectedTag])

  return (
    <div className="max-w-[85rem] mx-auto px-6 py-6 lg:flex gap-8 justify-center">
      {/* Filter Sidebar */}
      <section className="filter-section">
        <Card className="p-5 sticky top-10 lg:w-[19rem]">
          <div className="flex justify-between items-center lg:w-[16rem]">
            <p className="text-xl tracking-wider font-semibold text-gray-800">
              Filters
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:bg-gray-200 active:bg-gray-300 hover:text-black transition-colors"
            >
              <MixerHorizontalIcon className="h-5 w-5" />
            </Button>
          </div>

          <CardContent className="mt-5 p-0">
            <ScrollArea className="space-y-7 h-[70vh]">
              <div>
                <h1 className="pb-3 text-gray-500 border-b font-medium">
                  Categories
                </h1>
                <div className="pt-5">
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={(val) => setSelectedCategory(val)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="r1" />
                      <Label htmlFor="r1" className="cursor-pointer text-gray-700">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fullstack" id="r2" />
                      <Label htmlFor="r2" className="cursor-pointer text-gray-700">
                        Full Stack
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="frontend" id="r3" />
                      <Label htmlFor="r3" className="cursor-pointer text-gray-700">
                        Frontend
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="backend" id="r4" />
                      <Label htmlFor="r4" className="cursor-pointer text-gray-700">
                        Backend
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="pt-9">
                <h1 className="pb-3 text-gray-500 border-b font-medium">Tags</h1>
                <div className="pt-5">
                  <RadioGroup
                    value={selectedTag}
                    onValueChange={(val) => setSelectedTag(val)}
                  >
                    {tags.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <RadioGroupItem value={item} id={`tag-${item}`} />
                        <Label
                          htmlFor={`tag-${item}`}
                          className="cursor-pointer text-gray-700"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Project Cards List */}
      <section className="projectListSection flex-1 max-w-[54rem]">
        <div className="space-y-5 min-h-[74vh]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-500 text-base font-medium">
                Real empty!
              </p>
              <p className="text-gray-400 text-xs mt-1">
                No projects found.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectList