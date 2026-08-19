import { useState } from 'react'
import { 
  BookOpen, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Layers, 
  ArrowRight, 
  Plus, 
  FolderPlus 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TestFormModal from '../components/TestFormModal'
import DeleteTestDialog from '../components/DeleteTestDialog'
import OrgTestSetsView from './OrgTestSetsView'
import type { TestFormData } from '../utils/testValidation'

export interface TestItem {
  id: string
  name: string
  description: string
  setsCount: number
}

const MOCK_TESTS: TestItem[] = [
  {
    id: 'test-1',
    name: 'Machine Learning Foundations',
    description: 'Comprehensive evaluation covering supervised learning, regression models, and neural network optimization.',
    setsCount: 4,
  },
  {
    id: 'test-2',
    name: 'Algorithms & Data Structures',
    description: 'Assessments on dynamic programming, graph algorithms, trees, and minimum cost flow networks.',
    setsCount: 2,
  },
  {
    id: 'test-3',
    name: 'GATE CS Comprehensive Mock',
    description: 'Full-length multi-subject mock assessments tailored for competitive readiness.',
    setsCount: 8,
  },
  {
    id: 'test-4',
    name: 'Database Management Systems & SQL',
    description: 'Testing indexing, relational algebra, ACID transactions, and query optimization.',
    setsCount: 3,
  },
]

export default function OrgTestsView() {
  const [tests, setTests] = useState<TestItem[]>(MOCK_TESTS)
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null)

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    test: TestItem | null
  }>({
    isOpen: false,
    test: null,
  })

  const [deletingTest, setDeletingTest] = useState<TestItem | null>(null)

  // 1. If a test is selected, render Test Sets View
  if (selectedTest) {
    return (
      <OrgTestSetsView
        testId={selectedTest.id}
        testName={selectedTest.name}
        onBack={() => setSelectedTest(null)}
      />
    )
  }

  const handleSaveTest = (data: TestFormData, id?: string) => {
    if (id) {
      setTests((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, name: data.name, description: data.description || '' } : t
        )
      )
    } else {
      const newTest: TestItem = {
        id: `test-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        setsCount: 0,
      }
      setTests((prev) => [newTest, ...prev])
    }
  }

  const handleConfirmDelete = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id))
    setDeletingTest(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tests</h2>
            <Badge variant="secondary" className="text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-lg px-2">
              {tests.length} Total
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, organize, and manage your tests and underlying test sets.
          </p>
        </div>

        {tests.length > 0 && (
          <Button 
            onClick={() => setModalState({ isOpen: true, test: null })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Test
          </Button>
        )}
      </div>

      {/* Grid vs Empty State */}
      {tests.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <FolderPlus className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Tests Created Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a test to group and manage your test sets.
              </p>
            </div>

            <Button 
              onClick={() => setModalState({ isOpen: true, test: null })} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-5 gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Create Test
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card 
              key={test.id} 
              onClick={() => setSelectedTest(test)}
              className="group relative rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-indigo-400 to-sky-400 opacity-80" />

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-50 to-indigo-100/60 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-[11px] font-medium text-indigo-600 bg-indigo-50/50 border-indigo-100/80 gap-1.5 py-0.5"
                    >
                      <Layers className="h-3 w-3" />
                      <span>{test.setsCount} {test.setsCount === 1 ? 'Set' : 'Sets'}</span>
                    </Badge>
                  </div>

                  {/* 3-Dot menu with event propagation stopped */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-0 bg-transparent">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 rounded-xl p-1 shadow-lg border-slate-200 bg-white z-30">
                        <DropdownMenuItem 
                          onClick={() => setModalState({ isOpen: true, test })}
                          className="text-xs font-medium gap-2 rounded-lg cursor-pointer py-2 text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-slate-100" />
                        <DropdownMenuItem 
                          onClick={() => setDeletingTest(test)}
                          className="text-xs font-medium gap-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer py-2"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {test.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {test.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTest(test)
                    }}
                    className="w-full h-9 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/70 border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-between px-3.5 transition-all cursor-pointer group/btn"
                  >
                    <span>Manage Test Sets</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <TestFormModal
        isOpen={modalState.isOpen}
        test={modalState.test}
        onClose={() => setModalState({ isOpen: false, test: null })}
        onSubmit={handleSaveTest}
      />

      {/* Delete Dialog */}
      <DeleteTestDialog
        isOpen={Boolean(deletingTest)}
        test={deletingTest}
        onClose={() => setDeletingTest(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}