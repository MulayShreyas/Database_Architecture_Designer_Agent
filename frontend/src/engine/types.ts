// Schema Intermediate Representation (IR) Types
// This is the core data structure that the AI generates and the UI manipulates

export type SQLDialect = "mysql" | "postgresql";

export type ColumnType =
  | "integer"
  | "bigint"
  | "smallint"
  | "serial"
  | "bigserial"
  | "varchar"
  | "text"
  | "char"
  | "boolean"
  | "date"
  | "timestamp"
  | "timestamptz"
  | "time"
  | "decimal"
  | "numeric"
  | "float"
  | "double"
  | "json"
  | "jsonb"
  | "uuid"
  | "blob"
  | "enum";

export type Cardinality = "one-to-one" | "one-to-many" | "many-to-many";

export type OnDeleteAction =
  | "CASCADE"
  | "SET NULL"
  | "SET DEFAULT"
  | "RESTRICT"
  | "NO ACTION";

export interface ColumnDefinition {
  id: string;
  name: string;
  type: ColumnType;
  length?: number; // For varchar, char
  precision?: number; // For decimal, numeric
  scale?: number; // For decimal, numeric
  isPrimaryKey: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string | number | boolean | null;
  enumValues?: string[]; // For enum type
  comment?: string;
}

export interface IndexDefinition {
  id: string;
  name: string;
  columns: string[]; // Column names
  isUnique: boolean;
  type?: "btree" | "hash" | "gin" | "gist"; // PostgreSQL specific
}

export interface ForeignKeyDefinition {
  id: string;
  constraintName: string;
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete: OnDeleteAction;
  onUpdate?: OnDeleteAction;
}

export interface TableDefinition {
  id: string;
  name: string;
  schema?: string; // For PostgreSQL schemas
  columns: ColumnDefinition[];
  indexes: IndexDefinition[];
  foreignKeys: ForeignKeyDefinition[];
  comment?: string;
}

export interface RelationshipDefinition {
  id: string;
  name: string; // Descriptive name like "user_writes_posts"
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  cardinality: Cardinality;
  onDelete: OnDeleteAction;
  // For many-to-many, this defines the junction table
  junctionTable?: {
    name: string;
    sourceColumn: string;
    targetColumn: string;
  };
}

export interface ProcedureParameter {
  name: string;
  type: ColumnType;
  direction: "IN" | "OUT" | "INOUT";
  defaultValue?: string;
}

export interface StoredProcedureDefinition {
  id: string;
  name: string;
  parameters: ProcedureParameter[];
  returnType?: ColumnType | "void" | "table";
  body: string; // SQL body
  language?: "sql" | "plpgsql" | "plsql"; // For PostgreSQL
  comment?: string;
}

export interface SchemaDefinition {
  id: string;
  name: string;
  description: string;
  dialect: SQLDialect;
  tables: TableDefinition[];
  relationships: RelationshipDefinition[];
  storedProcedures: StoredProcedureDefinition[];
  createdAt: string;
  updatedAt: string;
}

// Helper type for UI state
export interface SchemaState {
  schema: SchemaDefinition | null;
  compiledSQL: string;
  compiledMermaid: string;
  isLoading: boolean;
  error: string | null;
  selectedTableId: string | null;
  selectedRelationshipId: string | null;
}

// API request/response types
export interface GenerateSchemaRequest {
  prompt: string;
  dialect: SQLDialect;
  additionalContext?: string;
}

export interface GenerateSchemaResponse {
  schema: SchemaDefinition;
  success: boolean;
  error?: string;
}

// Utility function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Default empty schema
export function createEmptySchema(
  dialect: SQLDialect = "postgresql",
): SchemaDefinition {
  return {
    id: generateId(),
    name: "New Schema",
    description: "",
    dialect,
    tables: [],
    relationships: [],
    storedProcedures: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
